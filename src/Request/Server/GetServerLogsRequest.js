const ServerRequest = require('./ServerRequest');

class GetServerLogsRequest extends ServerRequest {
    endpoint = "server/{id}/logs";
}

module.exports = GetServerLogsRequest;