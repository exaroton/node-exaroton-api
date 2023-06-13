const FileRequest = require("../FileRequest");

class UpdateConfigFileOptionsRequest extends FileRequest {
    endpoint = "servers/{id}/files/config/{path}";
    method = "POST";

    /**
     * UpdateConfigFileOptionsRequest constructor
     *
     * @param {string} id
     * @param {string} path
     * @param {Object.<string, string|number|boolean|string[]>} options
     */
    constructor(id, path, options) {
        super(id, path);

        this.data = options;
    }
}

module.exports = UpdateConfigFileOptionsRequest;
