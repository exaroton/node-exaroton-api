
export default class BackupAccount {
    /**
     * Unique backup account ID
     *
     * @type {string}
     */
    id;

    /**
     * Display name of the backup account
     *
     * @type {string}
     */
    name;

    /**
     * Cloud storage provider ("google-drive", "dropbox" or "onedrive")
     *
     * @type {string}
     */
    provider;

    /**
     * Storage usage and limit in bytes, each null if unknown
     *
     * @type {{used: number|null, limit: number|null}|null}
     */
    storage;

    /**
     * BackupAccount constructor
     *
     * @param {{}} backupAccountObject
     */
    constructor(backupAccountObject) {
        this.id = typeof backupAccountObject.id !== "undefined" ? backupAccountObject.id : null;
        this.name = typeof backupAccountObject.name !== "undefined" ? backupAccountObject.name : null;
        this.provider = typeof backupAccountObject.provider !== "undefined" ? backupAccountObject.provider : null;
        this.storage = typeof backupAccountObject.storage === "object" ? backupAccountObject.storage : null;
    }
}
