const FileRequest = require('./FileRequest');

class GetFileInformationRequest extends FileRequest {
    endpoint = "servers/{id}/files/info/{path}";
}

module.exports = GetFileInformationRequest;