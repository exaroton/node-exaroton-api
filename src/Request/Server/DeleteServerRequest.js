import ServerRequest from './ServerRequest.js'

export default class DeleteServerRequest extends ServerRequest {
    endpoint = "servers/{id}";
    method = "DELETE";
}
