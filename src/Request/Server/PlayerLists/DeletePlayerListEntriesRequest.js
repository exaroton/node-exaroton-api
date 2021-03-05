const PlayerListRequest = require('./PlayerListRequest');

class DeletePlayerListEntriesRequest extends PlayerListRequest {
    method = "DELETE";
    constructor(id, name, entries) {
        super(id, name);
        this.data = {entries: entries};
    }
}

module.exports = DeletePlayerListEntriesRequest;