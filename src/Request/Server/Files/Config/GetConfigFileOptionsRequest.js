const FileRequest = require("../FileRequest");

class GetConfigFileOptionsRequest extends FileRequest {
    endpoint = "servers/{id}/files/config/{path}";
}

module.exports = GetConfigFileOptionsRequest;
