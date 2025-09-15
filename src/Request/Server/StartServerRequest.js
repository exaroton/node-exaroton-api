import ServerRequest from './ServerRequest.js'

export default class StartServerRequest extends ServerRequest {
    endpoint = "servers/{id}/start";
    method = "POST";

    /**
     * StartServerRequest constructor
     *
     * @param {string} id
     * @param {boolean} useOwnCredits
     */
    constructor(id, useOwnCredits = false) {
        super(id);
        this.data = {
            useOwnCredits: useOwnCredits
        };
    }
}
