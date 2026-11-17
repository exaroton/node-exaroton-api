import EventEmitter from 'events'

import WebsocketClient from '../Websocket/WebsocketClient.js'
import Software from './Software.js'
import Players from './Players.js'
import ServerStatus from './ServerStatus.js'
import PlayerList from './PlayerList.js'
import File from './File.js'
import GetServerRequest from '../Request/Server/GetServerRequest.js'
import StartServerRequest from '../Request/Server/StartServerRequest.js'
import StopServerRequest from '../Request/Server/StopServerRequest.js'
import RestartServerRequest from '../Request/Server/RestartServerRequest.js'
import ExecuteServerCommandRequest from '../Request/Server/ExecuteServerCommandRequest.js'
import GetServerLogsRequest from '../Request/Server/GetServerLogsRequest.js'
import ShareServerLogsRequest from '../Request/Server/ShareServerLogsRequest.js'
import GetServerOptionRequest from '../Request/Server/GetServerOptionRequest.js'
import SetServerOptionRequest from '../Request/Server/SetServerOptionRequest.js'
import GetPlayerListsRequest from '../Request/Server/PlayerLists/GetPlayerListsRequest.js'
import ExtendServerStopTimeRequest from '../Request/Server/ExtendServerStopTimeRequest.js'
import DeleteServerRequest from '../Request/Server/DeleteServerRequest.js'
import GetServerSoftwareRequest from '../Request/Server/Software/GetServerSoftwareRequest.js'
import InstallServerSoftwareRequest from '../Request/Server/Software/InstallServerSoftwareRequest.js'
import SoftwareDetails from './SoftwareDetails.js'
import GetServerPropertiesRequest from '../Request/Server/GetServerPropertiesRequest.js'
import SetServerPropertiesRequest from '../Request/Server/SetServerPropertiesRequest.js'
import TransferServerRequest from '../Request/Server/TransferServerRequest.js'
import GetServerTransactionsRequest from '../Request/Server/GetServerTransactionsRequest.js'
import GetBackupsRequest from '../Request/Server/Backups/GetBackupsRequest.js'
import CreateBackupRequest from '../Request/Server/Backups/CreateBackupRequest.js'
import GetBackupAccountsRequest from '../Request/Server/Backups/GetBackupAccountsRequest.js'
import GetBackupSettingsRequest from '../Request/Server/Backups/GetBackupSettingsRequest.js'
import UpdateBackupSettingsRequest from '../Request/Server/Backups/UpdateBackupSettingsRequest.js'
import GetDomainsRequest from '../Request/Server/Domains/GetDomainsRequest.js'
import AddDomainRequest from '../Request/Server/Domains/AddDomainRequest.js'
import GetAccessListRequest from '../Request/Server/Access/GetAccessListRequest.js'
import AddAccessRequest from '../Request/Server/Access/AddAccessRequest.js'
import Backup from './Backup/Backup.js'
import BackupSettings from './Backup/BackupSettings.js'
import Domain from './Domain.js'
import Access from './Access.js'

export default class Server extends EventEmitter {
    /**
     * Shorthand to get server status constants
     *
     * @return {{LOADING: number, STARTING: number, SAVING: number, RESTARTING: number, PENDING: number, PREPARING: number, STOPPING: number, OFFLINE: number, ONLINE: number, CRASHED: number, TRANSFERRING: number}}
     */
    get STATUS() {
        return ServerStatus
    };

    /**
     * @type {Client}
     * @private
     */
    #client;

    /**
     * @type {WebsocketClient}
     */
    #websocketClient;

    /**
     * Unique server ID
     *
     * @type {string}
     */
    id;

    /**
     * Server name
     *
     * @type {string}
     */
    name;

    /**
     * Full server address (e.g. example.exaroton.me)
     *
     * @type {string}
     */
    address;

    /**
     * MOTD
     *
     * @type {string}
     */
    motd;

    /**
     * Server status (see ./ServerStatus.js)
     *
     * @type {int}
     */
    status;

    /**
     * Host address, only available if the server is online
     *
     * @type {string|null}
     */
    host = null;

    /**
     * Server port, only available if the server is online
     *
     * @type {null}
     */
    port = null;

    /**
     * Check if this an owned or a shared server
     *
     * @type {boolean}
     */
    shared = false;

    /**
     * Permissions of the current account on this server via Share Access
     *
     * Always null if the current account owns the server
     *
     * @type {string[]|null}
     */
    permissions = null;

    /**
     * ID of the region the server is located in (see Client.getRegions())
     *
     * @type {string|null}
     */
    region = null;

    /**
     * Server software
     *
     * @type {Software}
     */
    software;

    /**
     * Player data
     *
     * @type {Players}
     */
    players;

    /**
     * Player lists
     *
     * @type {{{string}: PlayerList}}
     */
    #playerLists = {};

    /**
     * Server constructor
     *
     * @param {Client} client
     * @param {string} id
     */
    constructor(client, id) {
        super();
        this.#client = client;
        this.id = id;
    }

    /**
     * @return {Client}
     */
    getClient() {
        return this.#client;
    }

    /**
     * Get/update the server info
     *
     * @return {this}
     * @throws {RequestError}
     */
    async get() {
        let response = await this.#client.request(new GetServerRequest(this.id));
        this.setFromObject(response.getData());
        return this;
    }

    /**
     * Permanently delete the server including all of its files
     *
     * Only possible for the owner of the server and only while the server is offline or crashed
     *
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async delete() {
        let response = await this.#client.request(new DeleteServerRequest(this.id));
        if (this.#websocketClient) {
            this.#websocketClient.disconnect();
        }
        return response;
    }

    /**
     * Start the server
     *
     * @param {boolean} useOwnCredits
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async start(useOwnCredits = false) {
        return this.#client.request(new StartServerRequest(this.id, useOwnCredits));
    }

    /**
     * Stop the server
     *
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async stop() {
        return this.#client.request(new StopServerRequest(this.id));
    }

    /**
     * Restart the server
     *
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async restart() {
        return this.#client.request(new RestartServerRequest(this.id));
    }

    /**
     * Execute a command in the server console
     *
     * @param {string} command
     * @return {Promise<Response|boolean>}
     */
    async executeCommand(command) {
        if (this.#websocketClient && this.#websocketClient.hasStream("console")) {
            /** @type {ConsoleStream} stream **/
            let stream = this.#websocketClient.getStream("console");
            if (stream.isStarted()) {
                stream.sendCommand(command);
                return true;
            }
        }
        return this.#client.request(new ExecuteServerCommandRequest(this.id, command));
    }

    /**
     * Extend the time until the server automatically stops
     *
     * @param {number} time
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async extendStopTime(time) {
        return this.#client.request(new ExtendServerStopTimeRequest(this.id, time));
    }

    /**
     * Get information about installing a specific software on the server
     *
     * Check SoftwareDetails.reinstall to see if installing it would delete all server files
     *
     * @param {string} softwareId
     * @return {Promise<SoftwareDetails>}
     * @throws {RequestError}
     */
    async getSoftwareDetails(softwareId) {
        let response = await this.#client.request(new GetServerSoftwareRequest(this.id, softwareId));
        return new SoftwareDetails(response.getData());
    }

    /**
     * Install a software on the server
     *
     * If the software requires a reinstall, reinstall has to be set to true to confirm
     * that all existing server files will be deleted.
     *
     * @param {string} softwareId
     * @param {boolean} reinstall
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async installSoftware(softwareId, reinstall = false) {
        return this.#client.request(new InstallServerSoftwareRequest(this.id, softwareId, reinstall));
    }

    /**
     * Get the content of the server logs
     *
     * This is cached and will not return the latest updates immediately.
     *
     * @returns {Promise<string>}
     */
    async getLogs() {
        let response = await this.#client.request(new GetServerLogsRequest(this.id));
        return response.getData().content;
    }

    /**
     * Upload the content of the server logs to mclo.gs
     *
     * Returns the URL of the logs on mclo.gs
     *
     * @returns {Promise<string>}
     */
    async shareLogs() {
        let response = await this.#client.request(new ShareServerLogsRequest(this.id));
        return response.getData().url;
    }

    /**
     * Get the assigned max server RAM in GB
     *
     * @return {Promise<int>}
     */
    getRAM() {
        return this.getOption("ram");
    }

    /**
     * Set the assigned max server RAM in GB
     *
     * @param {int} ram
     * @return {Promise<Response>}
     */
    setRAM(ram) {
        return this.setOption("ram", ram);
    }

    /**
     * Get the server MOTD
     *
     * @returns {Promise<string>}
     */
    getMOTD() {
        return this.getOption("motd");
    }

    /**
     * Set the server MOTD
     *
     * @param {string} motd
     * @returns {Promise<Response>}
     */
    setMOTD(motd) {
        return this.setOption("motd", motd);
    }

    /**
     * Get a server option
     *
     * @param option
     * @return {Promise<*>}
     */
    async getOption(option) {
        let response = await this.#client.request(new GetServerOptionRequest(this.id, option));
        return response.getData()[option];
    }

    /**
     * Set a server option
     *
     * @param option
     * @param value
     * @return {Promise<Response>}
     */
    setOption(option, value) {
        return this.#client.request(new SetServerOptionRequest(this.id, option, value));
    }

    /**
     * Get the server properties (e.g. "autostop") as a map of property name to value
     *
     * Only properties that are available for this server and that the current account is allowed to change are included.
     *
     * @return {Promise<Object.<string, string|number|boolean>>}
     * @throws {RequestError}
     */
    async getProperties() {
        let response = await this.#client.request(new GetServerPropertiesRequest(this.id));
        return response.getData();
    }

    /**
     * Change one or more server properties
     *
     * Properties that are not included are not changed. Either all properties are changed or none.
     * Returns all properties after the change.
     *
     * @param {Object.<string, string|number|boolean>} properties
     * @return {Promise<Object.<string, string|number|boolean>>}
     * @throws {RequestError}
     */
    async setProperties(properties) {
        let response = await this.#client.request(new SetServerPropertiesRequest(this.id, properties));
        return response.getData();
    }

    /**
     * Transfer the server to another region (see Client.getRegions())
     *
     * The server has to be offline. The transfer runs asynchronously: the server has the status TRANSFERRING
     * while its files are copied and returns to its previous status with the new region afterwards.
     *
     * @param {string} region
     * @return {Promise<this>}
     * @throws {RequestError}
     */
    async transfer(region) {
        let response = await this.#client.request(new TransferServerRequest(this.id, region));
        this.setFromObject(response.getData());
        return this;
    }

    /**
     * Get a page of the server transactions (20 per page), newest first
     *
     * @param {number} page
     * @return {Promise<Page<Transaction>>}
     * @throws {RequestError}
     */
    async getTransactions(page = 1) {
        let response = await this.#client.request(new GetServerTransactionsRequest(this.id, page));
        return response.getData();
    }

    /**
     * Get a page of the server backups (20 per page), newest first
     *
     * BackupPage.running is true while a backup is being created or restored on this server.
     *
     * @param {number} page
     * @return {Promise<BackupPage>}
     * @throws {RequestError}
     */
    async getBackups(page = 1) {
        let backups = (await this.#client.request(new GetBackupsRequest(this.id, page))).getData();
        for (let backup of backups.items) {
            backup.setServer(this);
        }
        return backups;
    }

    /**
     * Start creating a manual backup
     *
     * The backup is created asynchronously and has the status "creating" until it is done.
     * If creating the backup fails, the backup is deleted.
     *
     * @param {import('../Request/Server/Backups/CreateBackupRequest.js').CreateBackupOptions} options
     * @return {Promise<Backup>}
     * @throws {RequestError}
     */
    async createBackup(options = {}) {
        let data = (await this.#client.request(new CreateBackupRequest(this.id, options))).getData();
        return new Backup(data.id).setFromObject(data).setServer(this).setClient(this.#client);
    }

    /**
     * Get a backup object by ID
     *
     * This doesn't request the backup info yet, use Backup.get() for that.
     *
     * @param {string} id
     * @return {Backup}
     */
    getBackup(id) {
        return new Backup(id).setServer(this).setClient(this.#client);
    }

    /**
     * Get the backup accounts linked to the server
     *
     * @return {Promise<BackupAccount[]>}
     * @throws {RequestError}
     */
    async getBackupAccounts() {
        return (await this.#client.request(new GetBackupAccountsRequest(this.id))).getData();
    }

    /**
     * Get the automatic backup settings
     *
     * @return {Promise<BackupSettings>}
     * @throws {RequestError}
     */
    async getBackupSettings() {
        let response = await this.#client.request(new GetBackupSettingsRequest(this.id));
        return new BackupSettings(response.getData());
    }

    /**
     * Change the automatic backup settings
     *
     * Settings that are not included are kept.
     *
     * @param {import('../Request/Server/Backups/UpdateBackupSettingsRequest.js').BackupSettingsOptions} settings
     * @return {Promise<BackupSettings>}
     * @throws {RequestError}
     */
    async setBackupSettings(settings) {
        let response = await this.#client.request(new UpdateBackupSettingsRequest(this.id, settings));
        return new BackupSettings(response.getData());
    }

    /**
     * Get the custom domains of the server
     *
     * @return {Promise<Domain[]>}
     * @throws {RequestError}
     */
    async getDomains() {
        let domains = (await this.#client.request(new GetDomainsRequest(this.id))).getData();
        for (let domain of domains) {
            domain.setServer(this);
        }
        return domains;
    }

    /**
     * Add a custom domain to the server
     *
     * Set the NS records of the domain to Domain.nameservers to link it.
     *
     * @param {string} domain
     * @return {Promise<Domain>}
     * @throws {RequestError}
     */
    async addDomain(domain) {
        let data = (await this.#client.request(new AddDomainRequest(this.id, domain))).getData();
        return new Domain(data.id).setFromObject(data).setServer(this).setClient(this.#client);
    }

    /**
     * Get a custom domain object by ID
     *
     * This doesn't request the domain info yet, use Domain.get() for that.
     *
     * @param {string} id
     * @return {Domain}
     */
    getDomain(id) {
        return new Domain(id).setServer(this).setClient(this.#client);
    }

    /**
     * Get the accounts the server is shared with (without the owner)
     *
     * @return {Promise<Access[]>}
     * @throws {RequestError}
     */
    async getAccessList() {
        let accessList = (await this.#client.request(new GetAccessListRequest(this.id))).getData();
        for (let access of accessList) {
            access.setServer(this);
        }
        return accessList;
    }

    /**
     * Share the server with another exaroton account
     *
     * @param {string} username
     * @param {string[]|null} permissions defaults to ["server"]
     * @return {Promise<Access>}
     * @throws {RequestError}
     */
    async addAccess(username, permissions = null) {
        let data = (await this.#client.request(new AddAccessRequest(this.id, username, permissions))).getData();
        return new Access(data.id).setFromObject(data).setServer(this).setClient(this.#client);
    }

    /**
     * Get an access object by ID
     *
     * This doesn't request the access info yet, use Access.get() for that.
     *
     * @param {string} id
     * @return {Access}
     */
    getAccess(id) {
        return new Access(id).setServer(this).setClient(this.#client);
    }

    /**
     * Get all player lists available for the server
     *
     * @returns {Promise<PlayerList[]>}
     */
    async getPlayerLists() {
        let lists = (await this.#client.request(new GetPlayerListsRequest(this.id))).getData();
        this.#playerLists = {};
        for (let list of lists) {
            list.setServer(this);
            this.#playerLists[list.getName()] = list;
        }
        return lists;
    }

    /**
     * Get a player list by name
     *
     * @param name
     * @returns {PlayerList}
     */
    getPlayerList(name) {
        if (typeof this.#playerLists[name] !== "undefined") {
            return this.#playerLists[name];
        }
        this.#playerLists[name] = new PlayerList(name).setServer(this).setClient(this.#client);
        return this.#playerLists[name];
    }

    /**
     * Get a file object for a server file
     *
     * This doesn't request file info or content yet.
     * Use the File.getInfo() and File.getContent() functions for that
     *
     * @param {string} path The path of the file relative to the server root
     * @return {File}
     */
    getFile(path) {
        return new File(path).setServer(this).setClient(this.#client);
    }

    /**
     * Check if the server has one or one of multiple status codes
     *
     * Use this.STATUS.<STATUS> for status codes
     *
     * @param {int|int[]} status
     */
    hasStatus(status) {
        if (typeof status === "number") {
            return this.status === status;
        }

        for (let statusCode of status) {
            if (this.status === statusCode) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get a websocket client for this server
     *
     * @return {WebsocketClient}
     */
    getWebsocketClient() {
        if (!this.#websocketClient) {
            this.#websocketClient = new WebsocketClient(this);
            this.#websocketClient.on("status", (server) => this.emit("status", server));
            this.#websocketClient.on("event", (data) => this.emit(data.stream + ":" + data.type, data.data));
        }
        return this.#websocketClient;
    }

    /**
     * Subscribe to one or multiple streams
     *
     * @return {boolean}
     * @param {string[]|string} [streams]
     */
    subscribe(streams) {
        let websocketClient = this.getWebsocketClient();
        if (!websocketClient.isConnected()) {
            websocketClient.connect();
        }
        if (!streams) {
            return false;
        }

        if (typeof streams === "string") {
            streams = [streams];
        }

        for (let stream of streams) {
            let websocketStream = websocketClient.getStream(stream)
            if (!websocketStream) {
                return false;
            }
            websocketStream.start();
        }
        return true;
    }

    /**
     * Unsubscribe from one, multiple or all streams
     *
     * @param {string[]|string} [streams]
     */
    unsubscribe(streams) {
        let websocketClient = this.getWebsocketClient();
        if (!streams) {
            websocketClient.disconnect();
            return;
        }

        if (typeof streams === "string") {
            streams = [streams];
        }

        for (let stream of streams) {
            let websocketStream = websocketClient.getStream(stream)
            if (websocketStream) {
                websocketStream.stop();
            }
        }
        return true;
    }

    /**
     * Map raw object to this instance
     *
     * @param {{}} server
     * @return {this}
     */
    setFromObject(server) {
        this.id = typeof server.id !== "undefined" ? server.id : null;
        this.name = typeof server.name !== "undefined" ? server.name : null;
        this.address = typeof server.address !== "undefined" ? server.address : null;
        this.motd = typeof server.motd !== "undefined" ? server.motd : null;
        this.status = typeof server.status !== "undefined" ? server.status : null;
        this.host = typeof server.host !== "undefined" ? server.host : null;
        this.port = typeof server.port !== "undefined" ? server.port : null;
        this.shared = typeof server.shared !== "undefined" ? server.shared : null;
        this.permissions = Array.isArray(server.permissions) ? server.permissions : null;
        this.region = typeof server.region !== "undefined" ? server.region : null;

        this.software = null;
        if (typeof server.software === "object" && server.software !== null) {
            this.software = new Software(server.software);
        }

        this.players = null;
        if (typeof server.players === "object") {
            this.players = new Players(server.players);
        }
        return this;
    }

    /**
     * Only return intended public fields for JSON serialization
     *
     * Otherwise, fields inherited from EventEmitter would be serialized as well
     *
     * @returns {{}}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            address: this.address,
            motd: this.motd,
            status: this.status,
            host: this.host,
            port: this.port,
            shared: this.shared,
            permissions: this.permissions,
            region: this.region,
            software: this.software,
            players: this.players
        }
    }
}
