import ServerRequest from '../ServerRequest.js'
import AccessListResponse from '../../../Response/AccessListResponse.js'

export default class GetAccessListRequest extends ServerRequest {
    endpoint = "servers/{id}/access";
    responseClass = AccessListResponse;
}
