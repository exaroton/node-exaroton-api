const EventEmitter = require('events');

class Stream extends EventEmitter {
    /**
     * @type {WebsocketClient}
     */
    #client;

    /**
     * @type {boolean}
     */
    #started = false;

    /**
     * @type {boolean}
     */
    #shouldStart = false;

    /**
     * @type {string}
     */
    name;

    /**
     * @type {{}}
     */
    startData;

    /**
     * @type {number[]}
     */
    startStatuses = [1, 2, 3, 4];

    /**
     * @param {WebsocketClient} client
     */
    constructor(client) {
        super();
        this.#client = client;
        this.#client.on('status', this.onStatusChange.bind(this));
        this.#client.on('ready', this.onStatusChange.bind(this));
        this.#client.on('disconnected', this.onDisconnected.bind(this));
        this.#client.on('close', this.onDisconnected.bind(this));
    }

    /**
     * @param type
     * @param data
     */
    send(type, data) {
        this.#client.send(this.name, type, data);
    }

    /**
     * Status change event
     */
    onStatusChange() {
        this.tryToStart();
        this.tryToStop();
    }

    /**
     * Message event listener
     *
     * @param message
     */
    onMessage(message) {
        switch (message.type) {
            case "started":
                this.emit("started");
                this.#started = true;
                break;
            case "stopped":
                this.emit("stopped");
                this.#started = false;
                break;
            default:
                this.onDataMessage(message.type, message);
        }
    }

    onDataMessage(type, message) {
        this.emitEvent(type, message.data);
    }

    onDisconnected() {
        this.#started = false;
    }

    /**
     * Double event emitter for generic or specific event handling
     *
     * @param type
     * @param data
     */
    emitEvent(type, data) {
        this.emit(type, data);
        this.emit("event", {stream: this.name, type: type, data: data});
    }

    /**
     * Start this stream
     */
    start(data) {
        if (data) {
            this.startData = data;
        }
        this.#shouldStart = true;
        this.tryToStart();
    }

    /**
     * Should/can this stream be started
     *
     * @return {boolean}
     */
    async shouldBeStarted() {
        return this.#shouldStart && this.startStatuses.includes(await this.#client.getServerStatus());
    }

    /**
     * Try to start if possible
     *
     * @return {boolean}
     */
    async tryToStart() {
        if (this.#started || !this.#client.isReady() || !await this.shouldBeStarted()) {
            return false;
        }

        this.send("start", this.startData);
    }

    /**
     * Stop this stream
     */
    stop() {
        this.#shouldStart = false;
        this.tryToStop();
        delete this.#client.removeStream(this.name);
    }

    /**
     * Try to stop this stream if possible
     *
     * @return {boolean}
     */
    async tryToStop() {
        if (!this.#started || await this.shouldBeStarted()) {
            return false;
        }
        this.send("stop");
    }

    /**
     * @return {boolean}
     */
    isStarted() {
        return this.#started;
    }
}

module.exports = Stream;