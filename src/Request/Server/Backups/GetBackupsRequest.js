import ServerRequest from '../ServerRequest.js'
import BackupPageResponse from '../../../Response/BackupPageResponse.js'

export default class GetBackupsRequest extends ServerRequest {
    endpoint = "servers/{id}/backups";
    responseClass = BackupPageResponse;

    /**
     * GetBackupsRequest constructor
     *
     * @param {string} id
     * @param {number} page
     */
    constructor(id, page = 1) {
        super(id);
        this.setQueryParameter("page", String(page));
    }
}
