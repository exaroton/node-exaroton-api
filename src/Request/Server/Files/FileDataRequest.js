import FileRequest from './FileRequest.js'

export default class FileDataRequest extends FileRequest {
    endpoint = "servers/{id}/files/data/{path}";
}
