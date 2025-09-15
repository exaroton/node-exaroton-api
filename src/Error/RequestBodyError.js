import RequestError from './RequestError.js'

export default class RequestBodyError extends RequestError {
    /**
     * @param {Response} response fetch response object
     * @param {any} data response data
     */
    constructor(response, data) {
        super();
        this.setErrorFromResponseBody(response, data);
    }
}
