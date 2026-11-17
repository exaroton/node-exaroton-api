import ServerRequest from '../ServerRequest.js'

export default class AddDomainRequest extends ServerRequest {
    endpoint = "servers/{id}/domains";
    method = "POST";

    /**
     * AddDomainRequest constructor
     *
     * @param {string} id
     * @param {string} domain
     */
    constructor(id, domain) {
        super(id);
        this.data = {domain: domain};
    }
}
