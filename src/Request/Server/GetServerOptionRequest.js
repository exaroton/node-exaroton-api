const ServerRequest = require('./ServerRequest');

class GetServerOptionRequest extends ServerRequest {
    endpoint = "servers/{id}/options/{option}/";

    /**
     * GetServerOptionRequest constructor
     *
     * @param {string} id
     * @param {string} option
     */
    constructor(id, option) {
        super(id);
        this.setOption(option);
    }

    /**
     * Set the option name
     *
     * @param option
     */
    setOption(option) {
        this.setParameter("option", option);
    }
}

module.exports = GetServerOptionRequest;