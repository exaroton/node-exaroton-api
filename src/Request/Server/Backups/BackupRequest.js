import ServerRequest from '../ServerRequest.js'

export default class BackupRequest extends ServerRequest {
    endpoint = "servers/{id}/backups/{backupId}";

    /**
     * BackupRequest constructor
     *
     * @param {string} id
     * @param {string} backupId
     */
    constructor(id, backupId) {
        super(id);
        this.setParameter("backupId", backupId);
    }
}
