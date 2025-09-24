import Request from '../Request.js'

export default class ServerRequest extends Request {
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
