import GetBackupSettingsRequest from './GetBackupSettingsRequest.js'

/**
 * @typedef {Object} BackupSettingsOptions
 * @property {boolean} [enabled] Whether automatic backups are enabled
 * @property {number} [limit] How many automatic backups are kept (2-1000)
 * @property {21600|43200|86400|172800} [interval] Interval between automatic backups in seconds
 */

export default class UpdateBackupSettingsRequest extends GetBackupSettingsRequest {
    method = "POST";

    /**
     * UpdateBackupSettingsRequest constructor
     *
     * @param {string} id
     * @param {BackupSettingsOptions} settings
     */
    constructor(id, settings) {
        super(id);
        this.data = settings;
    }
}
