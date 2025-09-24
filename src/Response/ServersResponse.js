import Server from '../Server/Server.js'
import ArrayResponse from './ArrayResponse.js'

export default class ServersResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new Server(this.request.client, item.id).setFromObject(item);
    }
}
