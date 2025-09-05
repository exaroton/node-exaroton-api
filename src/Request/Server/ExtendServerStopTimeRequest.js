const ServerRequest = require('./ServerRequest');

class ExtendServerStopTimeRequest extends ServerRequest {
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

module.exports = ExtendServerStopTimeRequest;
