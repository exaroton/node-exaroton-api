import ServerRequest from '../ServerRequest.js'
import DomainsResponse from '../../../Response/DomainsResponse.js'

export default class GetDomainsRequest extends ServerRequest {
    endpoint = "servers/{id}/domains";
    responseClass = DomainsResponse;
}
