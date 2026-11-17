import ServerRequest from '../ServerRequest.js'

/**
 * @typedef {Object} CreateBackupOptions
 * @property {string} [name] Backup name, at most 512 bytes. The default name is used if this is not set.
 * @property {string} [backupAccount] ID of the backup account to store the backup in. Defaults to the first linked backup account.
 */

export default class CreateBackupRequest extends ServerRequest {
    endpoint = "servers/{id}/backups";
    method = "POST";

    /**
     * CreateBackupRequest constructor
     *
     * @param {string} id
     * @param {CreateBackupOptions} options
     */
    constructor(id, options = {}) {
        super(id);
        this.data = options;
    }
}
