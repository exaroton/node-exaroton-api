import RequestError from './RequestError.js'

export default class RequestStatusError extends RequestError {
    /**
     * @param {Response} response fetch response object
     * @param {any} data response data
     */
    constructor(response, data) {
        super();
        this.setErrorFromResponseBody(response, data);
    }
}
