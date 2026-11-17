import Request from '../Request.js'
import RegionsResponse from '../../Response/RegionsResponse.js'

export default class GetRegionsRequest extends Request {
    endpoint = "regions";
    responseClass = RegionsResponse;
}
