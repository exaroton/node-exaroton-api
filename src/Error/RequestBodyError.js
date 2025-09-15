import RequestError from './RequestError.js'

export default class RequestBodyError extends RequestError {
    constructor(response) {
        super();
        this.setErrorFromResponseBody(response);
    }
}
