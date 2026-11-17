import PageResponse from './PageResponse.js'
import Transaction from '../Billing/Transaction.js'

export default class TransactionPageResponse extends PageResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new Transaction(item);
    }
}
