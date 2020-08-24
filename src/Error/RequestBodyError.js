const RequestError = require('./RequestError');

class RequestBodyError extends RequestError {
    constructor(response) {
        super();
        this.setErrorFromResponseBody(response);
    }
}

module.exports = RequestBodyError;