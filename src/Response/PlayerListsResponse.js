const PlayerList = require('../Server/PlayerList');
const Response = require('./Response');

class PlayerListsResponse extends Response {
    /**
     * @type {PlayerList[]}
     */
    lists = [];

    /**
     * @inheritDoc
     */
    setBody(body) {
        super.setBody(body);

        if (!Array.isArray(body.data)) {
            return;
        }

        for (let playerListName of body.data) {
            this.lists.push(new PlayerList(playerListName).setClient(this.request.client));
        }
    }

    /**
     * @inheritDoc
     */
    getData() {
        return this.lists;
    }
}
module.exports = PlayerListsResponse;