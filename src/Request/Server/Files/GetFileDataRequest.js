const FileDataRequest = require("./FileDataRequest");

class GetFileDataRequest extends FileDataRequest {
    responseType = "text";
}

module.exports = GetFileDataRequest;