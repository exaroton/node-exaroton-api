const Software = require('./Software');
const Players = require('./Players');
const ServerStatus = require('./ServerStatus');
const GetServerRequest = require('../Request/Server/GetServerRequest');
const StartServerRequest = require('../Request/Server/StartServerRequest');
const StopServerRequest = require('../Request/Server/StopServerRequest');
const RestartServerRequest = require('../Request/Server/RestartServerRequest');
const ExecuteServerCommandRequest = require('../Request/Server/ExecuteServerCommandRequest');

class Server {
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
     * Server constructor
     *
     * @param {Client} client
     * @param {string} id
     */
    constructor(client, id) {
        this.#client = client;
        this.id = id;
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
     * @return {Promise<Response>}
     */
    async executeCommand(command) {
        return this.#client.request(new ExecuteServerCommandRequest(this.id, command));
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
}

module.exports = Server;