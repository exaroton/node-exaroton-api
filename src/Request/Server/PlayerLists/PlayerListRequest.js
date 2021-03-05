const ServerRequest = require('../ServerRequest');

class PlayerListRequest extends ServerRequest {
    endpoint = "servers/{id}/playerlists/{name}/";
    constructor(id, name) {
        super(id);
        this.setParameter("name", name);
    }
}

module.exports = PlayerListRequest;