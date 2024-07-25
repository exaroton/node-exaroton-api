const PlayerList = require('../Server/PlayerList');
const ArrayResponse = require("./ArrayResponse.js");

class PlayerListsResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new PlayerList(item).setClient(this.request.client);
    }
}
module.exports = PlayerListsResponse;
