import FileRequest from '../FileRequest.js'

export default class GetConfigFileOptionsRequest extends FileRequest {
    endpoint = "servers/{id}/files/config/{path}";
}
