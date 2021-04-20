const EventEmitter = require('events');
const WebSocket = require('ws');

/**
 * Websocket client to connect to the websocket for this server
 */
class WebsocketClient extends EventEmitter {
    /**
     * @type {string}
     */
    protocol = "wss";

    /**
     * @type {Client}
     * @private
     */
    #client;

    /**
     * @type {Server}
     * @private
     */
    #server;

    /**
     * @type {WebSocket}
     */
    #websocket;

    /**
     * Automatically reconnect in case of a disconnect
     *
     * @type {boolean}
     */
    autoReconnect = true;

    /**
     * Time to wait to reconnect
     *
     * Only change this with caution. A time too low here can
     * cause a spam in requests which can get your application
     * rate limited or even blocked.
     *
     * @type {number}
     */
    reconnectTimeout = 3000;

    /**
     * @type {boolean}
     */
    #connected = false;

    /**
     * @param {Server} server
     */
    constructor(server) {
        super();
        this.#server = server;
        this.#client = server.getClient();
        this.protocol = this.#client.protocol === "https" ? "wss" : "ws";
        this.url = this.protocol + "://" + this.#client.host + this.#client.basePath + "servers/" + this.#server.id + "/websocket";
    }

    /**
     * Connect to websocket
     */
    connect() {
        this.#connected = true;
        this.#websocket = new WebSocket(this.url, {headers: {authorization: "Bearer " + this.#client.getAPIToken()}});
        this.#websocket.on('open', this.onOpen.bind(this));
        this.#websocket.on('close', this.onClose.bind(this));
        this.#websocket.on('error', this.onError.bind(this));
        this.#websocket.on('message', this.onMessage.bind(this));
    }

    onOpen() {
        this.emit('open');
    }

    onClose() {
        this.emit('close');
        if (this.autoReconnect) {
            this.setTimeout(this.connect.bind(this), this.reconnectTimeout);
        } else {
            this.#connected = false;
        }
    }

    onError(error) {
        this.emit('error', error);
    }

    onMessage(rawMessage) {
        let message = JSON.parse(rawMessage);

        if (message.type === "ready") {
            this.emit('ready');
            return;
        }

        if (message.type === "status" && message.stream === "status") {
            this.#server.setFromObject(message.data);
            this.emit('status', this.#server);
            return;
        }
    }

    /**
     * @return {boolean}
     */
    isConnected() {
        return this.#connected;
    }
}

module.exports = WebsocketClient;