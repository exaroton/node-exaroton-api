import PlayerListRequest from './PlayerListRequest.js'

export default class DeletePlayerListEntriesRequest extends PlayerListRequest {
    method = "DELETE";
    constructor(id, name, entries) {
        super(id, name);
        this.data = {entries: entries};
    }
}
