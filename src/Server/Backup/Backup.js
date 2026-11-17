import GetBackupRequest from '../../Request/Server/Backups/GetBackupRequest.js'
import RenameBackupRequest from '../../Request/Server/Backups/RenameBackupRequest.js'
import DeleteBackupRequest from '../../Request/Server/Backups/DeleteBackupRequest.js'
import RestoreBackupRequest from '../../Request/Server/Backups/RestoreBackupRequest.js'

export default class Backup {
    /**
     * Unique backup ID
     *
     * @type {string}
     */
    id;

    /**
     * Backup name, null if it has the default name
     *
     * @type {string|null}
     */
    name = null;

    /**
     * "automatic" or "manual"
     *
     * @type {string|null}
     */
    type = null;

    /**
     * "creating" while the backup is being created, "created" once it is done
     *
     * @type {string|null}
     */
    status = null;

    /**
     * ID of the server the backup was created from
     *
     * @type {string|null}
     */
    server = null;

    /**
     * ID of the software the server had when the backup was created
     *
     * @type {string|null}
     */
    software = null;

    /**
     * Backup size in bytes
     *
     * @type {number|null}
     */
    size = null;

    /**
     * Unix timestamp of when the backup was created
     *
     * @type {number|null}
     */
    created = null;

    /**
     * ID of the backup account the backup is stored in
     *
     * @type {string|null}
     */
    backupAccount = null;

    /**
     * @type {Server}
     */
    #server;

    /**
     * @type {Client}
     */
    #client;

    /**
     * Backup constructor
     *
     * @param {string} id
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * Set the server
     *
     * @param {Server} server
     * @return {this}
     */
    setServer(server) {
        this.#server = server;
        return this;
    }

    /**
     * Set the API client
     *
     * @param {Client} client
     * @return {this}
     */
    setClient(client) {
        this.#client = client;
        return this;
    }

    /**
     * Map raw object to this instance
     *
     * @param {{}} backup
     * @return {this}
     */
    setFromObject(backup) {
        this.id = typeof backup.id !== "undefined" ? backup.id : null;
        this.name = typeof backup.name !== "undefined" ? backup.name : null;
        this.type = typeof backup.type !== "undefined" ? backup.type : null;
        this.status = typeof backup.status !== "undefined" ? backup.status : null;
        this.server = typeof backup.server !== "undefined" ? backup.server : null;
        this.software = typeof backup.software !== "undefined" ? backup.software : null;
        this.size = typeof backup.size !== "undefined" ? backup.size : null;
        this.created = typeof backup.created !== "undefined" ? backup.created : null;
        this.backupAccount = typeof backup.backupAccount !== "undefined" ? backup.backupAccount : null;
        return this;
    }

    /**
     * Check if the backup is still being created
     *
     * @return {boolean}
     */
    isCreating() {
        return this.status === "creating";
    }

    /**
     * Get/update the backup info
     *
     * Fails with status code 404 if the backup doesn't exist (anymore), e.g. because creating it failed
     *
     * @return {Promise<this>}
     * @throws {RequestError}
     */
    async get() {
        let response = await this.#client.request(new GetBackupRequest(this.#server.id, this.id));
        return this.setFromObject(response.getData());
    }

    /**
     * Rename the backup
     *
     * An empty name resets it to the default name. Renaming an automatic backup turns it into a manual backup.
     *
     * @param {string} name
     * @return {Promise<this>}
     * @throws {RequestError}
     */
    async rename(name) {
        let response = await this.#client.request(new RenameBackupRequest(this.#server.id, this.id, name));
        return this.setFromObject(response.getData());
    }

    /**
     * Delete the backup from its backup account
     *
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async delete() {
        return this.#client.request(new DeleteBackupRequest(this.#server.id, this.id));
    }

    /**
     * Start restoring the backup to the server, replacing its current files
     *
     * The server has to be offline. The restore runs asynchronously, check BackupPage.running
     * (see Server.getBackups()) to see when it is done.
     *
     * @return {Promise<this>}
     * @throws {RequestError}
     */
    async restore() {
        let response = await this.#client.request(new RestoreBackupRequest(this.#server.id, this.id));
        return this.setFromObject(response.getData());
    }
}
