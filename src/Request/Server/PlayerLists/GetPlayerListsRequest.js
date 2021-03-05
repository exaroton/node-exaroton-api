const ServerRequest = require('../ServerRequest');
const PlayerListResponse = require('../../../Response/PlayerListsResponse');

class GetPlayerListsRequest extends ServerRequest {
    endpoint = "servers/{id}/playerlists";
    responseClass = PlayerListResponse;
}

module.exports = GetPlayerListsRequest;