import ArrayResponse from './ArrayResponse.js'
import PoolMember from '../Billing/Pool/PoolMember.js'

export default class PoolMembersResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new PoolMember(item);
    }
}
