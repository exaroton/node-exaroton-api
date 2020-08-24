const Software = require('./Software');
const ServerStatus = require('./ServerStatus');
const GetServerRequest = require('../Request/Server/GetServerRequest');
const StartServerRequest = require('../Request/Server/StartServerRequest');
const StopServerRequest = require('../Request/Server/StopServerRequest');
const RestartServerRequest = require('../Request/Server/RestartServerRequest');
const ExecuteServerCommandRequest = require('../Request/Server/ExecuteServerCommandRequest');

/**
 * @type {Client}
 * @private
 */
let _client;

class Server {
    STATUS = ServerStatus;

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
     * Server software
     *
     * @type {Software}
     */
    software;

    /**
     * Server constructor
     *
     * @param {Client} client
     * @param {string} id
     */
    constructor(client, id) {
        _client = client;
        this.id = id;
    }

    /**
     * Get/update the server info
     *
     * @return {this}
     * @throws {RequestError}
     */
    async get() {
        let response = await _client.request(new GetServerRequest(this.id));
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
        return _client.request(new StartServerRequest(this.id));
    }

    /**
     * Stop the server
     *
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async stop() {
        return _client.request(new StopServerRequest(this.id));
    }

    /**
     * Restart the server
     *
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async restart() {
        return _client.request(new RestartServerRequest(this.id));
    }

    /**
     * Execute a command in the server console
     *
     * @param {string} command
     * @return {Promise<Response>}
     */
    async executeCommand(command) {
        return _client.request(new ExecuteServerCommandRequest(this.id, command));
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

        this.software = null;
        if (typeof server.software === "object") {
            this.software = new Software(server.software);
        }
        return this;
    }
}

module.exports = Server;