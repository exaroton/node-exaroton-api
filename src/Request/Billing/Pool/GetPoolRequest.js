import PoolRequest from './PoolRequest.js'

export default class GetPoolRequest extends PoolRequest {
    endpoint = "billing/pools/{id}";
}
