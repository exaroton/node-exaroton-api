import {randomUUID} from "crypto";
import Stream from "./Stream.js";
import ManagementProxyConnection from "./ManagementProxyConnection.js";

/**
 * @typedef {object} ManagementRequest
 * @property {string} id
 * @property {string} method
 * @property {object|array} params
 */

export default class ServerManagementStream extends Stream {
    name = "management";
    startStatuses = [1];
    #proxyConnection = new ManagementProxyConnection(this);
    /**
     * Map of request IDs to their resolve functions
     * @type {Map<string, function(*): void>}
     */
    #waitingForResponse = new Map();
    /**
     * @type {ManagementRequest[]}
     */
    #requestQueue = [];

    constructor(client) {
        super(client);

        this.on("started", this.#onStarted.bind(this));
    }

    onDataMessage(type, message) {
        switch (type) {
            case "notification":
                this.#proxyConnection.emit(message.data.name, message.data.data);
                break;
            case "response":
                if (!this.#waitingForResponse.has(message.data.id)) {
                    return;
                }

                this.#waitingForResponse.get(message.data.id)(message.data.data);
                break;
        }
    }

    async request(method, params) {
        if (!await this.shouldBeStarted()) {
            throw new Error("The management stream is not active.");
        }

        return new Promise((resolve, reject) => {
            const id = randomUUID();
            this.#waitingForResponse.set(id, resolve);
            const request = {id, method, params};
            if (!this.isStarted()) {
                this.#requestQueue.push(request);
            } else {
                this.#sendRequest(request);
            }
        });
    }

    #onStarted() {
        for (const request of this.#requestQueue) {
            this.#sendRequest(request)
        }
        this.#requestQueue = [];
    }

    #sendRequest(request) {
        this.send("request", request);
    }

    getProxyConnection() {
        return this.#proxyConnection;
    }
}
