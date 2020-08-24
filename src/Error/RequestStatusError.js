const RequestError = require('./RequestError');

class RequestStatusError extends RequestError {
    constructor(error) {
        super();
        if (!error.response || !this.setErrorFromResponseBody(error.response)) {
            this.message = error.toString();
        }
    }
}

module.exports = RequestStatusError;