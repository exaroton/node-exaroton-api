import BackupRequest from './BackupRequest.js'

export default class RenameBackupRequest extends BackupRequest {
    method = "PUT";

    /**
     * RenameBackupRequest constructor
     *
     * @param {string} id
     * @param {string} backupId
     * @param {string} name
     */
    constructor(id, backupId, name) {
        super(id, backupId);
        this.data = {name: name};
    }
}
