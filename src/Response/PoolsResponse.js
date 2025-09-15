import Pool from '../Billing/Pool/Pool.js'
import ArrayResponse from './ArrayResponse.js'

export default class PoolsResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new Pool(this.request.client, item.id).setFromObject(item);
    }
}
