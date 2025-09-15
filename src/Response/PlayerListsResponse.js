import PlayerList from '../Server/PlayerList.js'
import ArrayResponse from './ArrayResponse.js'

export default class PlayerListsResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new PlayerList(item).setClient(this.request.client);
    }
}
