import ServerRequest from '../ServerRequest.js'

export default class GetBackupSettingsRequest extends ServerRequest {
    endpoint = "servers/{id}/backup-settings";
}
