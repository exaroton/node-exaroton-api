class RequestError extends Error {
    statusCode;
    error;
    response;

    /**
     * Set error and status code from response object
     *
     * Returns if an error message was found
     *
     * @param {{}} response
     * @return {boolean}
     */
    setErrorFromResponseBody(response) {
        this.response = response;
        this.statusCode = typeof response.statusCode === "number" ? response.statusCode : 0;
        if (typeof response.body === "object" && typeof response.body.success === "boolean" && !response.body.success && typeof response.body.error === "string") {
            this.message = response.body.error;
            return true;
        }
        return false;
    }
}

module.exports = RequestError;