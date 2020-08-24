const ServerRequest = require('./ServerRequest');

class RestartServerRequest extends ServerRequest {
    endpoint = "server/{id}/restart";
}

module.exports = RestartServerRequest;