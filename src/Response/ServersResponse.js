const Server = require('../Server/Server');
const ArrayResponse = require("./ArrayResponse.js");

class ServersResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new Server(this.request.client, item.id).setFromObject(item);
    }
}

module.exports = ServersResponse;
