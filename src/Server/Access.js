import GetAccessRequest from '../Request/Server/Access/GetAccessRequest.js'
import UpdateAccessRequest from '../Request/Server/Access/UpdateAccessRequest.js'
import DeleteAccessRequest from '../Request/Server/Access/DeleteAccessRequest.js'

export default class Access {
    /**
     * Unique ID of the account's access to the server
     *
     * @type {string}
     */
    id;

    /**
     * The account the server is shared with
     *
     * @type {{id: string, name: string}|null}
     */
    account = null;

    /**
     * Permissions of the account on the server
     *
     * @type {string[]|null}
     */
    permissions = null;

    /**
     * @type {Server}
     */
    #server;

    /**
     * @type {Client}
     */
    #client;

    /**
     * Access constructor
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
     * @param {{}} access
     * @return {this}
     */
    setFromObject(access) {
        this.id = typeof access.id !== "undefined" ? access.id : null;
        this.account = typeof access.account === "object" ? access.account : null;
        this.permissions = Array.isArray(access.permissions) ? access.permissions : null;
        return this;
    }

    /**
     * Get/update the access info
     *
     * @return {Promise<this>}
     * @throws {RequestError}
     */
    async get() {
        let response = await this.#client.request(new GetAccessRequest(this.#server.id, this.id));
        return this.setFromObject(response.getData());
    }

    /**
     * Replace the permissions of the account on the server
     *
     * @param {string[]} permissions
     * @return {Promise<this>}
     * @throws {RequestError}
     */
    async setPermissions(permissions) {
        let response = await this.#client.request(new UpdateAccessRequest(this.#server.id, this.id, permissions));
        return this.setFromObject(response.getData());
    }

    /**
     * Remove the account's access to the server
     *
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async delete() {
        return this.#client.request(new DeleteAccessRequest(this.#server.id, this.id));
    }
}
