import ServerRequest from './ServerRequest.js'

export default class RestartServerRequest extends ServerRequest {
    endpoint = "servers/{id}/restart";
}
