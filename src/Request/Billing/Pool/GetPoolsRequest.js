import Request from '../../Request.js'
import PoolsResponse from '../../../Response/PoolsResponse.js'

export default class GetPoolsRequest extends Request {
    endpoint = "billing/pools";
    responseClass = PoolsResponse;
}
