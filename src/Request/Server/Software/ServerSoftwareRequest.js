import ServerRequest from '../ServerRequest.js'

export default class ServerSoftwareRequest extends ServerRequest {
    endpoint = "servers/{id}/software/{software}";

    /**
     * Server software request constructor
     *
     * @param {string} id
     * @param {string} softwareId
     */
    constructor(id, softwareId) {
        super(id);
        this.setParameter("software", softwareId);
    }
}
