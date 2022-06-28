const ServerRequest = require('../ServerRequest');

class FileRequest extends ServerRequest {
    /**
     * FileRequest constructor
     *
     * @param {string} id
     * @param {string} path
     */
    constructor(id, path) {
        super(id);
        this.setPath(path);
    }

    /**
     * Set the path parameter and url encode all characters except slashes
     *
     * @return {this}
     */
    setPath(path) {
        this.setParameter("path", path.replace(/[^\/]+/g, encodeURIComponent));
        return this;
    }
}

module.exports = FileRequest;