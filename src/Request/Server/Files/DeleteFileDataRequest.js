const FileDataRequest = require("./FileDataRequest");

class DeleteFileDataRequest extends FileDataRequest {
    method = "DELETE";
}

module.exports = DeleteFileDataRequest;