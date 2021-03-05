const ServerRequest = require('./ServerRequest');

class ExecuteServerCommandRequest extends ServerRequest {
    endpoint = "servers/{id}/command";
    method = "POST";

    /**
     * Server request constructor
     *
     * @param {string} id
     * @param {string} command
     */
    constructor(id, command) {
        super(id);

        this.data = {command: command};
    }
}

module.exports = ExecuteServerCommandRequest;