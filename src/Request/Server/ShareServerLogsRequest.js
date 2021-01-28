const ServerRequest = require('./ServerRequest');

class ShareServerLogsRequest extends ServerRequest {
    endpoint = "server/{id}/logs/share";
}

module.exports = ShareServerLogsRequest;