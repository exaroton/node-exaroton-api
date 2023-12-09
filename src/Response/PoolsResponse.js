const Pool = require('../Billing/Pool/Pool.js');
const ArrayResponse = require("./ArrayResponse.js");

class PoolsResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new Pool(this.request.client, item.id).setFromObject(item);
    }
}

module.exports = PoolsResponse;
