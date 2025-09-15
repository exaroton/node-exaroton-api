import Request from '../../Request.js'

export default class PoolRequest extends Request {
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
