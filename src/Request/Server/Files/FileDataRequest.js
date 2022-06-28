const FileRequest = require("./FileRequest");

class FileDataRequest extends FileRequest {
    endpoint = "servers/{id}/files/data/{path}";
}

module.exports = FileDataRequest;