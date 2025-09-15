import Request from './Request.js'
import ServersResponse from '../Response/ServersResponse.js'

export default class GetServersRequest extends Request {
    endpoint = "servers";
    responseClass = ServersResponse;

}
