import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
import { CustomAuthenticationProvider } from "./CustomAuthenticationProvider";

export class ClientFactory {
    public static CreateClientWitchSecret(tenantId: string, clientId: string, clientSecret: string): Client {
        let clientOptions: ClientOptions = {
            authProvider: new CustomAuthenticationProvider(tenantId, clientId, clientSecret),
        };

        return Client.initWithMiddleware(clientOptions);
    }
}