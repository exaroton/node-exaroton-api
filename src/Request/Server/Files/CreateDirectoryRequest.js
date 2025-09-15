import PutFileDataRequest from './PutFileDataRequest.js'

export default class CreateDirectoryRequest extends PutFileDataRequest {
    headers = {
        "Content-Type": "inode/directory"
    }
}
