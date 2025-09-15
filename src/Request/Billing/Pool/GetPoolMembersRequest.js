import PoolRequest from './PoolRequest.js'
import PoolMembersResponse from '../../../Response/PoolMembersResponse.js'

export default class GetPoolMembersRequest extends PoolRequest {
    endpoint = "billing/pools/{id}/members";
    responseClass = PoolMembersResponse;
}
