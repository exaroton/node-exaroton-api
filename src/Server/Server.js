const EventEmitter = require('events');

const WebsocketClient = require("../Websocket/WebsocketClient");
const Software = require('./Software');
const Players = require('./Players');
const ServerStatus = require('./ServerStatus');
const PlayerList = require('./PlayerList');
const File = require('./File');
const GetServerRequest = require('../Request/Server/GetServerRequest');
const StartServerRequest = require('../Request/Server/StartServerRequest');
const StopServerRequest = require('../Request/Server/StopServerRequest');
const RestartServerRequest = require('../Request/Server/RestartServerRequest');
const ExecuteServerCommandRequest = require('../Request/Server/ExecuteServerCommandRequest');
const GetServerLogsRequest = require('../Request/Server/GetServerLogsRequest');
const ShareServerLogsRequest = require('../Request/Server/ShareServerLogsRequest');
const GetServerOptionRequest = require('../Request/Server/GetServerOptionRequest');
const SetServerOptionRequest = require('../Request/Server/SetServerOptionRequest');
const GetPlayerListsRequest = require('../Request/Server/PlayerLists/GetPlayerListsRequest');

class Server extends EventEmitter {
    /**
     * Shorthand to get server status constants
     *
     * @return {{LOADING: number, STARTING: number, SAVING: number, RESTARTING: number, PENDING: number, PREPARING: number, STOPPING: number, OFFLINE: number, ONLINE: number, CRASHED: number}}
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
     * Start the server
     *
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async start() {
        return this.#client.request(new StartServerRequest(this.id));
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
            return;
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

        this.software = null;
        if (typeof server.software === "object") {
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
            software: this.software,
            players: this.players
        }
    }
}

module.exports = Server;