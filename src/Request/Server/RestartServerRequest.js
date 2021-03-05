const ServerRequest = require('./ServerRequest');

class RestartServerRequest extends ServerRequest {
    endpoint = "servers/{id}/restart";
}

module.exports = RestartServerRequest;