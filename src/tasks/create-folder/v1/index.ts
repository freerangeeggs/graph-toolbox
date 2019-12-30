import { GraphError } from '@microsoft/microsoft-graph-client';
import * as taskLibrary from 'azure-pipelines-task-lib/task';
import { ClientFactory } from './ClientFactory';

/**
 * @summary Creates a folder in a OneDrive for Business location or SharePoint Document Library.
 * @param {string} driveId The Microsoft Graph {@link https://docs.microsoft.com/en-us/graph/api/resources/driveitem?view=graph-rest-1.0|DriveItem} Id.
 * @param {string} folderName The name of the folder you wish to create.
 */
async function run() {
    try {
        const tenantId: string | undefined = taskLibrary.getInput('tenantId', true);
        const clientId: string | undefined = taskLibrary.getInput('clientId', true);
        const clientSecret: string | undefined = taskLibrary.getInput('clientSecret', true);
        const driveId: string | undefined = taskLibrary.getInput('driveId', true);
        const folderName: string | undefined = taskLibrary.getInput('folderName', true);

        if (tenantId === undefined) {
            throw new Error('Tenant id not specified');
        }

        if (clientId === undefined) {
            throw new Error('Client id not specified');
        }

        if (clientSecret === undefined) {
            throw new Error('Client secret not specified');
        }

        if (driveId === undefined) {
            throw new Error('DriveId not specified');
        }

        if (folderName === undefined) {
            throw new Error('Folder name not specified');
        }

        const client = ClientFactory.CreateClientWitchSecret(tenantId, clientId, clientSecret);

        const driveItem = {
            name: folderName,
            folder: {
            }
        };

        try {
            const response = await client.api(`/drives/${driveId}/root/children`).post(driveItem);
            taskLibrary.setResult(taskLibrary.TaskResult.Succeeded, `Successfully created folder to ${response.webUrl}`);
        }
        catch (err) {
            if (err instanceof GraphError) {
                const graphError: GraphError = err as GraphError;
                if (graphError.code === 'nameAlreadyExists') {
                    taskLibrary.setResult(taskLibrary.TaskResult.SucceededWithIssues, `Failed to create folder as it already exists.`);
                } else {
                    taskLibrary.setResult(taskLibrary.TaskResult.Failed, `${graphError.code}: ${graphError.message}`);
                }
            } else {
                throw err;
            }
        }
    }
    catch (err) {
        taskLibrary.setResult(taskLibrary.TaskResult.Failed, err.message);
    }
}

run();