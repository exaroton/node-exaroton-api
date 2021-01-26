const Request = require('../Request');

class GetAccountRequest extends Request {
    endpoint = "account/";
}

module.exports = GetAccountRequest;