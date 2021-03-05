const PlayerListRequest = require('./PlayerListRequest');

class PutPlayerListEntriesRequest extends PlayerListRequest {
    method = "PUT";
    constructor(id, name, entries) {
        super(id, name);
        this.data = {entries: entries};
    }
}

module.exports = PutPlayerListEntriesRequest;