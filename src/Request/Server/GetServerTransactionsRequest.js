import ServerRequest from './ServerRequest.js'
import TransactionPageResponse from '../../Response/TransactionPageResponse.js'

export default class GetServerTransactionsRequest extends ServerRequest {
    endpoint = "servers/{id}/transactions";
    responseClass = TransactionPageResponse;

    /**
     * GetServerTransactionsRequest constructor
     *
     * @param {string} id
     * @param {number} page
     */
    constructor(id, page = 1) {
        super(id);
        this.setQueryParameter("page", String(page));
    }
}
