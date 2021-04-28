const EventEmitter = require('events');
const WebSocket = require('ws');

const ConsoleStream = require("./ConsoleStream");
const HeapStream = require("./HeapStream");
const StatsStream = require("./StatsStream");
const TickStream = require("./TickStream");

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

    #reconnectInterval;

    /**
     * @type {boolean}
     */
    #connected = false;

    /**
     * @type {boolean}
     */
    #shouldConnect = false;

    /**
     * @type {boolean}
     */
    #serverConnected = false;

    /**
     * @type {boolean}
     */
    #ready = false;

    /**
     * @type {{{string}: Stream}}
     */
    #streams = {};

    #availableStreams = {
        "console": ConsoleStream,
        "heap": HeapStream,
        "stats": StatsStream,
        "tick": TickStream
    };

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
        this.#shouldConnect = true;
        this.#websocket = new WebSocket(this.url, {headers: {authorization: "Bearer " + this.#client.getAPIToken()}});
        this.#websocket.on('open', this.onOpen.bind(this));
        this.#websocket.on('close', this.onClose.bind(this));
        this.#websocket.on('error', this.onError.bind(this));
        this.#websocket.on('message', this.onMessage.bind(this));
        if (!this.streamRetryInterval) {
            this.streamRetryInterval = setInterval(this.tryToStartStreams.bind(this), 15000);
        }
    }

    /**
     * Disconnect from the websocket and all streams
     */
    disconnect() {
        this.#shouldConnect = false;
        this.#websocket.close();
        this.#streams = {};
        clearInterval(this.#reconnectInterval);
        clearInterval(this.streamRetryInterval);
        this.streamRetryInterval = null;
    }

    onOpen() {
        this.#connected = true;
        clearInterval(this.#reconnectInterval);
        this.emit('open');
    }

    onClose() {
        this.emit('close');
        this.#ready = false;
        if (this.autoReconnect && this.#shouldConnect) {
            this.#reconnectInterval = setInterval(this.connect.bind(this), this.reconnectTimeout);
        } else {
            this.#connected = false;
        }
    }

    onError(error) {
        this.emit('error', error);
    }

    onMessage(rawMessage) {
        let message = JSON.parse(rawMessage);

        // noinspection FallThroughInSwitchStatementJS
        switch (message.type) {
            case "keep-alive":
                break;
            case "ready":
                this.#ready = true;
                this.emit('ready');
                break;
            case "connected":
                this.#serverConnected = true;
                this.emit('connected');
                break;
            case "disconnected":
                this.#serverConnected = false;
                this.emit('disconnected');
                if (this.autoReconnect) {
                    setTimeout(this.tryToStartStreams.bind(this), this.reconnectTimeout);
                }
                break;
            case "status":
                if (message.stream === "status") {
                    this.#server.setFromObject(message.data);
                    this.emit('status', this.#server);
                    break;
                }
            default:
                if (message.stream && this.#streams[message.stream]) {
                    this.#streams[message.stream].onMessage(message);
                }
        }

    }

    /**
     * @return {boolean}
     */
    isConnected() {
        return this.#connected;
    }

    /**
     * @return {boolean}
     */
    isReady() {
        return this.#ready;
    }

    /**
     * @return {Server}
     */
    getServer() {
        return this.#server;
    }

    /**
     * @return {int|number}
     */
    async getServerStatus() {
        if (!Number.isInteger(this.#server.status)) {
            await this.#server.get();
        }
        return this.#server.status;
    }

    /**
     * Get a stream by name
     *
     * @param {string} stream
     * @return {boolean|Stream}
     */
    getStream(stream) {
        if (!this.#availableStreams[stream]) {
            return false;
        }

        if (this.#streams[stream]) {
            return this.#streams[stream];
        }

        this.#streams[stream] = new this.#availableStreams[stream](this);
        this.#streams[stream].on('event', (data) => this.emit('event', data));
        return this.#streams[stream];
    }

    /**
     * @param stream
     * @return {boolean}
     */
    hasStream(stream) {
        return !!this.#streams[stream];
    }

    tryToStartStreams() {
        for (let stream of Object.keys(this.#streams)) {
            this.#streams[stream].tryToStart();
        }
    }

    removeStream(stream) {
        delete this.#streams[stream];
    }

    /**
     * @param stream
     * @param type
     * @param data
     * @return {boolean}
     */
    send(stream, type, data) {
        if (this.#websocket.readyState !== 1 || !this.isReady()) {
            return false;
        }

        let message = {stream: stream, type: type};
        if (typeof data !== "undefined") {
            message.data = data;
        }
        this.#websocket.send(JSON.stringify(message));
    }
}

module.exports = WebsocketClient;