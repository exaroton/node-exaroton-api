import ServerRequest from '../ServerRequest.js'

export default class AddAccessRequest extends ServerRequest {
    endpoint = "servers/{id}/access";
    method = "POST";

    /**
     * AddAccessRequest constructor
     *
     * @param {string} id
     * @param {string} username
     * @param {string[]|null} permissions
     */
    constructor(id, username, permissions = null) {
        super(id);
        this.data = {username: username};
        if (permissions !== null) {
            this.data.permissions = permissions;
        }
    }
}
