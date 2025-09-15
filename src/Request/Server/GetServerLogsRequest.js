import ServerRequest from './ServerRequest.js'

export default class GetServerLogsRequest extends ServerRequest {
    endpoint = "servers/{id}/logs";
}
