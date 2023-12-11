const GetPoolRequest = require("../../Request/Billing/Pool/GetPoolRequest.js");
const GetPoolMembersRequest = require("../../Request/Billing/Pool/GetPoolMembersRequest.js");
const GetPoolServersRequest = require("../../Request/Billing/Pool/GetPoolServersRequest.js");

class Pool {
    /**
     * @type {Client}
     * @private
     */
    #client;

    /**
     * Pool ID
     *
     * @type {string}
     */
    id;

    /**
     * Pool name
     *
     * @type {string}
     */
    name;

    /**
     * Pool credit balance
     *
     * @type {number}
     */
    credits;

    /**
     * Pool server count
     *
     * @type {number}
     */
    servers;

    /**
     * Pool owner ID
     *
     * @type {string}
     */
    owner;

    /**
     * Is pool owner
     *
     * @type {boolean}
     */
    isOwner;

    /**
     * Pool member count
     *
     * @type {number}
     */
    members;

    /**
     * Share of this pool owned by the current account
     *
     * @type {number}
     */
    ownShare;

    /**
     * Credits in this pool owned by the current account
     *
     * @type {number}
     */
    ownCredits;

    /**
     * Pool constructor
     *
     * @param {Client} client
     * @param {string} id
     */
    constructor(client, id) {
        this.#client = client;
        this.id = id;
    }

    /**
     * @param {{}} poolObject
     * @return {this}
     */
    setFromObject(poolObject) {
        this.id = typeof poolObject.id !== "undefined" ? poolObject.id : null;
        this.name = typeof poolObject.name !== "undefined" ? poolObject.name : null;
        this.credits = typeof poolObject.credits !== "undefined" ? poolObject.credits : null;
        this.servers = typeof poolObject.servers !== "undefined" ? poolObject.servers : null;
        this.owner = typeof poolObject.owner !== "undefined" ? poolObject.owner : null;
        this.isOwner = typeof poolObject.isOwner !== "undefined" ? poolObject.isOwner : null;
        this.members = typeof poolObject.members !== "undefined" ? poolObject.members : null;
        this.ownShare = typeof poolObject.ownShare !== "undefined" ? poolObject.ownShare : null;
        this.ownCredits = typeof poolObject.ownCredits !== "undefined" ? poolObject.ownCredits : null;

        return this;
    }

    /**
     * Get credit pool info
     *
     * @return {this}
     * @throws {RequestError}
     */
    async get() {
        let response = await this.#client.request(new GetPoolRequest(this.id));
        this.setFromObject(response.getData());
        return this;
    }

    /**
     * Get pool members
     *
     * @return {Promise<PoolMember[]>}
     */
    async getMembers() {
        let response = await this.#client.request(new GetPoolMembersRequest(this.id));
        return response.getData();
    }

    /**
     * Get pool servers
     *
     * @return {Promise<Server[]>}
     */
    async getServers() {
        let response = await this.#client.request(new GetPoolServersRequest(this.id));
        return response.getData();
    }
}

module.exports = Pool;
