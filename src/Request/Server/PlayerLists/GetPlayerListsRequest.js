import ServerRequest from '../ServerRequest.js'
import PlayerListResponse from '../../../Response/PlayerListsResponse.js'

export default class GetPlayerListsRequest extends ServerRequest {
    endpoint = "servers/{id}/playerlists";
    responseClass = PlayerListResponse;
}
