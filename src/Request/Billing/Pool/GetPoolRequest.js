const PoolRequest = require("./PoolRequest.js");

class GetPoolRequest extends PoolRequest {
    endpoint = "billing/pools/{id}";
}

module.exports = GetPoolRequest;
