import ServerRequest from './ServerRequest.js'

export default class StopServerRequest extends ServerRequest {
    endpoint = "servers/{id}/stop";
}
