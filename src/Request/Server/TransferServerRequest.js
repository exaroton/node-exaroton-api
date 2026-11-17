import ServerRequest from './ServerRequest.js'

export default class TransferServerRequest extends ServerRequest {
    endpoint = "servers/{id}/transfer";
    method = "POST";

    /**
     * TransferServerRequest constructor
     *
     * @param {string} id
     * @param {string} region
     */
    constructor(id, region) {
        super(id);
        this.data = {region: region};
    }
}
