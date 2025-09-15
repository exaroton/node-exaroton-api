import ServerRequest from '../ServerRequest.js'

export default class PlayerListRequest extends ServerRequest {
    endpoint = "servers/{id}/playerlists/{name}/";
    constructor(id, name) {
        super(id);
        this.setParameter("name", name);
    }
}
