import ArrayResponse from './ArrayResponse.js'
import Access from '../Server/Access.js'

export default class AccessListResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new Access(item.id).setFromObject(item).setClient(this.request.client);
    }
}
