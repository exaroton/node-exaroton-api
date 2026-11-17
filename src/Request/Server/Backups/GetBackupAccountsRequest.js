import ServerRequest from '../ServerRequest.js'
import BackupAccountsResponse from '../../../Response/BackupAccountsResponse.js'

export default class GetBackupAccountsRequest extends ServerRequest {
    endpoint = "servers/{id}/backup-accounts";
    responseClass = BackupAccountsResponse;
}
