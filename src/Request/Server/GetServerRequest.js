const ServerRequest = require('./ServerRequest');

class GetServerRequest extends ServerRequest {
    endpoint = "servers/{id}";
}

module.exports = GetServerRequest;