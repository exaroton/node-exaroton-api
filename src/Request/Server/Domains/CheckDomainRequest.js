import DomainRequest from './DomainRequest.js'

export default class CheckDomainRequest extends DomainRequest {
    endpoint = "servers/{id}/domains/{domainId}/check";
    method = "POST";
}
