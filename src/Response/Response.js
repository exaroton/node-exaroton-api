class Response {
    /**
     * @type {Request}
     */
    request;

    /**
     * (raw/parsed) response body
     *
     * @type {{}|string}
     */
    body;

    /**
     * Response constructor
     *
     * @param {Request} request
     * @constructor
     */
    constructor(request) {
        this.request = request;
    }

    /**
     * Get the data from the response
     *
     * @return {*|null}
     */
    getData() {
        if (typeof this.body === "undefined" || this.body === null) {
            return null;
        }

        if (typeof this.body === "string") {
            return this.body;
        }

        return typeof this.body.data !== "undefined" ? this.body.data : null;
    }

    /**
     * Set the body to this.body and maybe parse content
     *
     * @param {{}|string} body
     */
    setBody(body) {
        this.body = body;
    }
}

module.exports = Response;