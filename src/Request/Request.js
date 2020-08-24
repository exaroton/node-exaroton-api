const FormData = require('form-data');

const Response = require('../Response/Response');

class Request {
    /**
     * Request method, e.g. "GET" or "POST"
     *
     * @type {string}
     */
    method = "GET";

    /**
     * Endpoint URL, without base, version or starting /
     */
    endpoint;

    /**
     * URL parameters, which are replaced in the endpoint string
     *
     * @type {{}}
     */
    parameters = {};

    /**
     * HTTP request headers
     *
     * @type {{}}
     */
    headers = {};

    /**
     * Post body data
     *
     * @type {null|{}}
     */
    data = null;

    /**
     * Response class used to create/parse responses to this request
     *
     * @type {Response}
     */
    responseClass = Response;

    /**
     * Client that has executed this request
     *
     * @type {Client}
     */
    client;

    /**
     * Set a URL parameter
     *
     * URL parameters replace {key} variables in the endpoint URL
     *
     * @param {string} key
     * @param {string} value
     */
    setParameter(key, value) {
        this.parameters[key] = value;
    }

    /**
     *
     * @param {string} key
     * @param {string} value
     */
    setHeader(key, value) {
        this.headers[key.toLowerCase()] = value;
    }

    /**
     * Get endpoint with replaced parameters
     *
     * @return {string}
     */
    getEndpoint() {
        let endpoint = this.endpoint;
        for (let key in this.parameters) {
            if (!this.parameters.hasOwnProperty(key)) {
                continue;
            }
            endpoint = endpoint.replace("{" + key + "}", this.parameters[key]);
        }
        return endpoint;
    }

    /**
     * Check if the request has a body
     *
     * @return {boolean}
     */
    hasBody() {
        return this.method === "POST" && this.data !== null;
    }

    /**
     * Get body for request
     *
     * @return {FormData|string}
     */
    getBody() {
        let body = new FormData();
        for (let key in this.data) {
            if (!this.data.hasOwnProperty(key)) {
                continue;
            }
            body.append(key, this.data[key]);
        }
        return body;
    }

    /**
     * Create a response object for this request
     *
     * @param {{}} body
     * @return {Response}
     */
    createResponse(body) {
        let response = new (this.responseClass)(this);
        response.setBody(body);
        return response;
    }
}

module.exports = Request;