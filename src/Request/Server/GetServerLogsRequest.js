const ServerRequest = require('./ServerRequest');

class GetServerLogsRequest extends ServerRequest {
    endpoint = "servers/{id}/logs";
}

module.exports = GetServerLogsRequest;