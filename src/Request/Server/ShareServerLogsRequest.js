const ServerRequest = require('./ServerRequest');

class ShareServerLogsRequest extends ServerRequest {
    endpoint = "servers/{id}/logs/share";
}

module.exports = ShareServerLogsRequest;