import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";
import axios, { AxiosRequestConfig } from 'axios';
import querystring from 'querystring';

export class CustomAuthenticationProvider implements AuthenticationProvider {
    private tenantId: string;
    private clientId: string;
    private clientSecret: string;
    private scope: string = 'https://graph.microsoft.com/.default';
    private grantType: string = 'client_credentials';

    constructor(tenantId: string, clientId: string, clientSecret: string)
    {
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    public async getAccessToken(): Promise<string> {
        const parameters = {
            client_id: this.clientId,
            scope: this.scope,
            client_secret: this.clientSecret,
            grant_type: this.grantType
        }

        const data = querystring.stringify(parameters);

        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }

        return await axios.post(`https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`, data, config)
            .then((response) => {
                return response.data.access_token;
            })
            .catch((error) => {
                throw error;
            });
    }
}