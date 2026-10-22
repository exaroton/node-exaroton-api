import GetAccountRequest from '../Request/Account/GetAccountRequest.js'

export default class Account {
    /**
     * @type {Client}
     * @private
     */
    #client;

    /**
     * Unique account ID
     *
     * @type {string}
     */
    id;

    /**
     * Username
     *
     * @type {string}
     */
    name;

    /**
     * Email address
     *
     * @type {string}
     */
    email;

    /**
     * Email address verification
     *
     * @type {boolean}
     */
    verified;

    /**
     * The amount of credits currently available
     *
     * @type {int}
     */
    credits;

    /**
     * Maximum number of servers this account can own
     *
     * @type {int}
     */
    maxServers;

    /**
     * Account constructor
     *
     * @param {Client} client
     */
    constructor(client) {
        this.#client = client;
    }

    /**
     * Get/update the account info
     *
     * @return {this}
     * @throws {RequestError}
     */
    async get() {
        let response = await this.#client.request(new GetAccountRequest());
        this.setFromObject(response.getData());
        return this;
    }

    /**
     * Map raw object to this instance
     *
     * @param {{}} account
     * @return {this}
     */
    setFromObject(account) {
        this.id = typeof account.id !== "undefined" ? account.id : null;
        this.name = typeof account.name !== "undefined" ? account.name : null;
        this.email = typeof account.email !== "undefined" ? account.email : null;
        this.verified = typeof account.verified !== "undefined" ? account.verified : null;
        this.credits = typeof account.credits !== "undefined" ? account.credits : null;
        this.maxServers = typeof account.maxServers !== "undefined" ? account.maxServers : null;
        return this;
    }
}
