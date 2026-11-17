import ArrayResponse from './ArrayResponse.js'
import Domain from '../Server/Domain.js'

export default class DomainsResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new Domain(item.id).setFromObject(item).setClient(this.request.client);
    }
}
