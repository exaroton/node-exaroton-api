import ServerRequest from './ServerRequest.js'

export default class GetServerPropertiesRequest extends ServerRequest {
    endpoint = "servers/{id}/options/properties";
}
