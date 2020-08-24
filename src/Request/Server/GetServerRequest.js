const ServerRequest = require('./ServerRequest');

class GetServerRequest extends ServerRequest {
    endpoint = "server/{id}";
}

module.exports = GetServerRequest;