import PoolRequest from './PoolRequest.js'
import ServersResponse from '../../../Response/ServersResponse.js'

export default class GetPoolServersRequest extends PoolRequest {
    endpoint = "billing/pools/{id}/servers";
    responseClass = ServersResponse;
}
