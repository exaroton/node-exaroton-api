const ServerRequest = require('./ServerRequest');

class StopServerRequest extends ServerRequest {
    endpoint = "servers/{id}/stop";
}

module.exports = StopServerRequest;