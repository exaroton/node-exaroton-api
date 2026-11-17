import Page from '../../Page/Page.js'

/**
 * @extends {Page<Backup>}
 */
export default class BackupPage extends Page {
    /**
     * Whether a backup is currently being created or restored on this server
     *
     * @type {boolean}
     */
    running;

    /**
     * @inheritDoc
     */
    setFromObject(pageObject) {
        super.setFromObject(pageObject);
        this.running = typeof pageObject.running !== "undefined" ? pageObject.running : null;
        return this;
    }
}
