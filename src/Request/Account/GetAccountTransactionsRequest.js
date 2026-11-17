import Request from '../Request.js'
import TransactionPageResponse from '../../Response/TransactionPageResponse.js'

export default class GetAccountTransactionsRequest extends Request {
    endpoint = "account/transactions";
    responseClass = TransactionPageResponse;

    /**
     * GetAccountTransactionsRequest constructor
     *
     * @param {number} page
     */
    constructor(page = 1) {
        super();
        this.setQueryParameter("page", String(page));
    }
}
