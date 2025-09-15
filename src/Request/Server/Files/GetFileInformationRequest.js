import FileRequest from './FileRequest.js'

export default class GetFileInformationRequest extends FileRequest {
    endpoint = "servers/{id}/files/info/{path}";
}
