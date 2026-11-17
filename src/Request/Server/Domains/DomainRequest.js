import ServerRequest from '../ServerRequest.js'

export default class DomainRequest extends ServerRequest {
    endpoint = "servers/{id}/domains/{domainId}";

    /**
     * DomainRequest constructor
     *
     * @param {string} id
     * @param {string} domainId
     */
    constructor(id, domainId) {
        super(id);
        this.setParameter("domainId", domainId);
    }
}
