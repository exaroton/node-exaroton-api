const Response = require('./Response');
const Server = require('../Server/Server');

class ServersResponse extends Response {
    /**
     * @type {Server[]}
     */
    servers = [];

    /**
     * @inheritDoc
     */
    setBody(body) {
        super.setBody(body);

        if (!Array.isArray(body.data)) {
            return;
        }

        for (let serverObject of body.data) {
            this.servers.push(new Server(this.request.client, serverObject.id).setFromObject(serverObject));
        }
    }

    /**
     * @inheritDoc
     */
    getData() {
        return this.servers;
    }
}

module.exports = ServersResponse;