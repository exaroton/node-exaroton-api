const ServerRequest = require('./ServerRequest');

class StartServerRequest extends ServerRequest {
    endpoint = "servers/{id}/start";
}

module.exports = StartServerRequest;