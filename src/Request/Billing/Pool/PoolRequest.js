const Request = require('../../Request.js');

class PoolRequest extends Request {
    /**
     * Pool request constructor
     *
     * @param {string} id
     */
    constructor(id) {
        super();
        this.setParameter("id", id);
    }
}

module.exports = PoolRequest;
