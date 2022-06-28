const FileDataRequest = require("./FileDataRequest");

class GetFileDataRequest extends FileDataRequest {
    responseType = "text";

    /**
     * @param {string} id
     * @param {string} path
     * @param {string|null} outputPath
     */
    constructor(id, path, outputPath = null) {
        super(id, path);
        this.outputPath = outputPath;
    }
}

module.exports = GetFileDataRequest;