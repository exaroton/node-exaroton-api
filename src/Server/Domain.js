import GetDomainRequest from '../Request/Server/Domains/GetDomainRequest.js'
import UpdateDomainRequest from '../Request/Server/Domains/UpdateDomainRequest.js'
import DeleteDomainRequest from '../Request/Server/Domains/DeleteDomainRequest.js'
import CheckDomainRequest from '../Request/Server/Domains/CheckDomainRequest.js'

export default class Domain {
    /**
     * Unique custom domain ID
     *
     * @type {string}
     */
    id;

    /**
     * The domain (lowercase)
     *
     * @type {string|null}
     */
    domain = null;

    /**
     * "pending", "linked" or "unlinked"
     *
     * @type {string|null}
     */
    status = null;

    /**
     * Protocol of the domain (e.g. "https")
     *
     * @type {string|null}
     */
    protocol = null;

    /**
     * Port of the domain
     *
     * @type {number|null}
     */
    port = null;

    /**
     * Unix timestamp of the last check
     *
     * @type {number|null}
     */
    checkedTime = null;

    /**
     * Unix timestamp of when the domain was added
     *
     * @type {number|null}
     */
    createdTime = null;

    /**
     * Nameservers the NS records of the domain have to point to
     *
     * @type {string[]|null}
     */
    nameservers = null;

    /**
     * @type {Server}
     */
    #server;

    /**
     * @type {Client}
     */
    #client;

    /**
     * Domain constructor
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
     * @param {{}} domain
     * @return {this}
     */
    setFromObject(domain) {
        this.id = typeof domain.id !== "undefined" ? domain.id : null;
        this.domain = typeof domain.domain !== "undefined" ? domain.domain : null;
        this.status = typeof domain.status !== "undefined" ? domain.status : null;
        this.protocol = typeof domain.protocol !== "undefined" ? domain.protocol : null;
        this.port = typeof domain.port !== "undefined" ? domain.port : null;
        this.checkedTime = typeof domain.checkedTime !== "undefined" ? domain.checkedTime : null;
        this.createdTime = typeof domain.createdTime !== "undefined" ? domain.createdTime : null;
        this.nameservers = Array.isArray(domain.nameservers) ? domain.nameservers : null;
        return this;
    }

    /**
     * Get/update the domain info
     *
     * @return {Promise<this>}
     * @throws {RequestError}
     */
    async get() {
        let response = await this.#client.request(new GetDomainRequest(this.#server.id, this.id));
        return this.setFromObject(response.getData());
    }

    /**
     * Change the protocol and/or port of the domain
     *
     * @param {import('../Request/Server/Domains/UpdateDomainRequest.js').DomainOptions} options
     * @return {Promise<this>}
     * @throws {RequestError}
     */
    async update(options) {
        let response = await this.#client.request(new UpdateDomainRequest(this.#server.id, this.id, options));
        return this.setFromObject(response.getData());
    }

    /**
     * Remove the domain from the server
     *
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async delete() {
        return this.#client.request(new DeleteDomainRequest(this.#server.id, this.id));
    }

    /**
     * Check again whether the NS records of the domain point to the nameservers
     *
     * A domain is checked at most every 10 seconds, linked domains are not checked again.
     *
     * @return {Promise<this>}
     * @throws {RequestError}
     */
    async check() {
        let response = await this.#client.request(new CheckDomainRequest(this.#server.id, this.id));
        return this.setFromObject(response.getData());
    }
}
