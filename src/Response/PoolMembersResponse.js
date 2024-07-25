const ArrayResponse = require("./ArrayResponse.js");
const PoolMember = require("../Billing/Pool/PoolMember.js");

class PoolMembersResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new PoolMember(item);
    }
}

module.exports = PoolMembersResponse;
