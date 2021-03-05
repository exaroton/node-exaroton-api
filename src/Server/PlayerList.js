const GetPlayerListEntriesRequest = require('../Request/Server/PlayerLists/GetPlayerListEntriesRequest');
const PutPlayerListEntriesRequest = require('../Request/Server/PlayerLists/PutPlayerListEntriesRequest');
const DeletePlayerListEntriesRequest = require('../Request/Server/PlayerLists/DeletePlayerListEntriesRequest');

class PlayerList {
    /**
     * List name / identifier
     *
     * @type {{string}}
     */
    name;

    /**
     * @type {{Server}}
     */
    #server;

    /**
     * @type {{Client}}
     */
    #client;

    /**
     * @param name
     */

    constructor(name) {
        this.name = name;
    }

    /**
     * Set the server for this list
     *
     * @param server
     * @returns {PlayerList}
     */
    setServer(server) {
        this.#server = server;
        return this;
    }

    /**
     * Set the API client
     *
     * @param client
     * @returns {PlayerList}
     */
    setClient(client) {
        this.#client = client;
        return this;
    }

    /**
     * Get the list name
     *
     * @returns {{string}}
     */
    getName() {
        return this.name;
    }

    /**
     * @returns {Promise<string[]>}
     */
    async getEntries() {
        return (await this.#client.request(new GetPlayerListEntriesRequest(this.#server.id, this.name))).getData();
    }

    /**
     * Add multiple entries
     *
     * @param entries
     * @returns {Promise<*>}
     */
    async addEntries(entries) {
        return this.#client.request(new PutPlayerListEntriesRequest(this.#server.id, this.name, entries));
    }

    /**
     * Add a single entry
     *
     * @param entry
     * @returns {Promise<*>}
     */
    async addEntry(entry) {
        return this.addEntries([entry]);
    }

    /**
     * Delete multiple entries
     *
     * @param {{string[]}} entries
     * @returns {Promise<*>}
     */
    async deleteEntries(entries) {
        return this.#client.request(new DeletePlayerListEntriesRequest(this.#server.id, this.name, entries));
    }

    /**
     * Delete a single entry
     *
     * @param {{string}} entry
     * @returns {Promise<*>}
     */
    async deleteEntry(entry) {
        return this.deleteEntries([entry]);
    }
}

module.exports = PlayerList;