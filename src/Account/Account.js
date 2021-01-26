const GetAccountRequest = require('../Request/Account/GetAccountRequest');

class Account {
    /**
     * @type {Client}
     * @private
     */
    #client;

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
        this.name = typeof account.name !== "undefined" ? account.name : null;
        this.email = typeof account.email !== "undefined" ? account.email : null;
        this.verified = typeof account.verified !== "undefined" ? account.verified : null;
        this.credits = typeof account.credits !== "undefined" ? account.credits : null;
        return this;
    }
}

module.exports = Account;