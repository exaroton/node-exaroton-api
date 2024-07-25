const PoolRequest = require("./PoolRequest.js");
const ServersResponse = require("../../../Response/ServersResponse.js");

class GetPoolServersRequest extends PoolRequest {
    endpoint = "billing/pools/{id}/servers";
    responseClass = ServersResponse;
}

module.exports = GetPoolServersRequest;
