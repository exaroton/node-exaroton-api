const PoolRequest = require("./PoolRequest.js");
const PoolMembersResponse = require("../../../Response/PoolMembersResponse.js");

class GetPoolMembersRequest extends PoolRequest {
    endpoint = "billing/pools/{id}/members";
    responseClass = PoolMembersResponse;
}

module.exports = GetPoolMembersRequest;
