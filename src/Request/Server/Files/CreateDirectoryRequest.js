const PutFileDataRequest = require("./PutFileDataRequest");

class CreateDirectoryRequest extends PutFileDataRequest {
    headers = {
        "Content-Type": "inode/directory"
    }
}

module.exports = CreateDirectoryRequest;