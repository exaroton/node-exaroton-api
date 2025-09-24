import PlayerListRequest from './PlayerListRequest.js'

export default class PutPlayerListEntriesRequest extends PlayerListRequest {
    method = "PUT";
    constructor(id, name, entries) {
        super(id, name);
        this.data = {entries: entries};
    }
}
