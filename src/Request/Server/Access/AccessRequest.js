import ServerRequest from '../ServerRequest.js'

export default class AccessRequest extends ServerRequest {
    endpoint = "servers/{id}/access/{accessId}";

    /**
     * AccessRequest constructor
     *
     * @param {string} id
     * @param {string} accessId
     */
    constructor(id, accessId) {
        super(id);
        this.setParameter("accessId", accessId);
    }
}
