
export default class BackupSettings {
    /**
     * Whether automatic backups are enabled
     *
     * @type {boolean}
     */
    enabled;

    /**
     * How many automatic backups are kept, older automatic backups are deleted
     *
     * @type {number}
     */
    limit;

    /**
     * Interval between automatic backups in seconds
     *
     * @type {number}
     */
    interval;

    /**
     * Number of automatic backups that failed in a row since the last successful one
     *
     * @type {number}
     */
    failed;

    /**
     * BackupSettings constructor
     *
     * @param {{}} settingsObject
     */
    constructor(settingsObject) {
        this.enabled = typeof settingsObject.enabled !== "undefined" ? settingsObject.enabled : null;
        this.limit = typeof settingsObject.limit !== "undefined" ? settingsObject.limit : null;
        this.interval = typeof settingsObject.interval !== "undefined" ? settingsObject.interval : null;
        this.failed = typeof settingsObject.failed !== "undefined" ? settingsObject.failed : null;
    }
}
