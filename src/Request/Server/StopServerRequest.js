const ServerRequest = require('./ServerRequest');

class StopServerRequest extends ServerRequest {
    endpoint = "server/{id}/stop";
}

module.exports = StopServerRequest;