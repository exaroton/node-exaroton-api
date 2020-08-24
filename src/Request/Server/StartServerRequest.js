const ServerRequest = require('./ServerRequest');

class StartServerRequest extends ServerRequest {
    endpoint = "server/{id}/start";
}

module.exports = StartServerRequest;