import AccessRequest from './AccessRequest.js'

export default class UpdateAccessRequest extends AccessRequest {
    method = "PUT";

    /**
     * UpdateAccessRequest constructor
     *
     * @param {string} id
     * @param {string} accessId
     * @param {string[]} permissions
     */
    constructor(id, accessId, permissions) {
        super(id, accessId);
        this.data = {permissions: permissions};
    }
}
