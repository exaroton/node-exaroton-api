export default class RequestError extends Error {
    statusCode = 0;
    /**
     * @type {Response|null} Response object that caused the error (if any)
     */
    response;

    /**
     * @param {Error|null} error
     */
    constructor(error = null) {
        super();
        if (error instanceof Error) {
            this.message = error.toString();
        }
    }

    /**
     * Set error and status code from response object
     *
     * Returns if an error message was found
     *
     * @param {Response} response fetch response object
     * @param {any} data response data
     */
    setErrorFromResponseBody(response, data) {
        this.response = response;
        this.statusCode = response.status;
        if (typeof data === "object" && typeof data.success === "boolean" && !data.success && typeof data.error === "string") {
            this.message = data.error;
        }
    }
}
