import ServerRequest from './ServerRequest.js'

export default class GetServerRequest extends ServerRequest {
    endpoint = "servers/{id}";
}
