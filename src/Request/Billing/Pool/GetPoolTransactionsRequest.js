import PoolRequest from './PoolRequest.js'
import TransactionPageResponse from '../../../Response/TransactionPageResponse.js'

export default class GetPoolTransactionsRequest extends PoolRequest {
    endpoint = "billing/pools/{id}/transactions";
    responseClass = TransactionPageResponse;

    /**
     * GetPoolTransactionsRequest constructor
     *
     * @param {string} id
     * @param {number} page
     */
    constructor(id, page = 1) {
        super(id);
        this.setQueryParameter("page", String(page));
    }
}
