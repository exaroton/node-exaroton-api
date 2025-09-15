import ServerRequest from './ServerRequest.js'

export default class ShareServerLogsRequest extends ServerRequest {
    endpoint = "servers/{id}/logs/share";
}
