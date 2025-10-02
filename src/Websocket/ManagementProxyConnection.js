import {Connection} from "mc-server-management";

export default class ManagementProxyConnection extends Connection {
    /**
     * @type {import('./ServerManagementStream.js').default}
     */
    stream;

    /**
     * @param {import('./ServerManagementStream.js').default} stream
     */
    constructor(stream) {
        super();
        this.stream = stream;
    }

    callRaw(method, parameters) {
        return this.stream.request(method, parameters);
    }

    close() {
        this.stream.stop();
    }
}
