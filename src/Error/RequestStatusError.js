import RequestError from './RequestError.js'

export default class RequestStatusError extends RequestError {
    constructor(error) {
        super();
        if (!error.response || !this.setErrorFromResponseBody(error.response)) {
            this.message = error.toString();
        }
    }
}
