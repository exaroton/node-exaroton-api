const Request = require('../../Request');
const PoolsResponse = require("../../../Response/PoolsResponse.js");

class GetPoolsRequest extends Request {
    endpoint = "billing/pools";
    responseClass = PoolsResponse;
}

module.exports = GetPoolsRequest;
