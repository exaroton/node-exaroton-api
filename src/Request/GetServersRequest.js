const Request = require('./Request');
const ServersResponse = require('../Response/ServersResponse');

class GetServersRequest extends Request {
    endpoint = "servers";
    responseClass = ServersResponse;

}

module.exports = GetServersRequest;