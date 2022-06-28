const FileDataRequest = require("./FileDataRequest");

class PutFileDataRequest extends FileDataRequest {
    method = "PUT";
}

module.exports = PutFileDataRequest;