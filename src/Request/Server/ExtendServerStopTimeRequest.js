import ServerRequest from './ServerRequest.js'

export default class ExtendServerStopTimeRequest extends ServerRequest {
    endpoint = "servers/{id}/extend-time";
    method = "POST";

    /**
     * ExecuteServerCommandRequest constructor
     *
     * @param {string} id
     * @param {number} time
     */
    constructor(id, time) {
        super(id);

        this.data = {time: time};
    }
}
