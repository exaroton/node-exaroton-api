const Request = require('../Request');

class ServerRequest extends Request {
    /**
     * Server request constructor
     *
     * @param {string} id
     */
    constructor(id) {
        super();
        this.setParameter("id", id);
    }
}

module.exports = ServerRequest;