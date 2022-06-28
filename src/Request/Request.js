const FormData = require('form-data');
const {createReadStream} = require('fs');

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
     * @type {null|{}|string}
     */
    data = null;

    /**
     * Response class used to create/parse responses to this request
     *
     * @type {Response}
     */
    responseClass = Response;

    /**
     * Response type (text|json|buffer)
     *
     * https://github.com/sindresorhus/got/blob/main/documentation/2-options.md#responsetype
     *
     * @type {string}
     */
    responseType = "json";

    /**
     * Optional path to write the response body to
     *
     * @type {string|null}
     */
    outputPath = null;

    /**
     * Optional path to read the request body from
     *
     * @type {string|null}
     */
    inputPath = null;

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
        return ["POST", "PUT", "DELETE"].includes(this.method) && (this.data !== null || this.inputPath !== null);
    }

    /**
     * Get body for request
     *
     * @return {FormData|string|ReadStream}
     */
    getBody() {
        if (this.shouldStreamFromFile()) {
            return createReadStream(this.inputPath);
        }

        if (typeof this.data === "string") {
            return this.data;
        }

        let body = new FormData();
        for (let key in this.data) {
            if (!this.data.hasOwnProperty(key)) {
                continue;
            }
            if (Array.isArray(this.data[key])) {
                for (let element of this.data[key]) {
                    body.append(key + "[]", element);
                }
                continue;
            }
            body.append(key, this.data[key]);
        }
        return body;
    }

    /**
     * Create a response object for this request
     *
     * @param {{}|string|null} body
     * @return {Response}
     */
    createResponse(body= null) {
        let response = new (this.responseClass)(this);
        response.setBody(body);
        return response;
    }

    /**
     * @return {boolean}
     */
    expectsJsonResponse() {
        return this.responseType === "json";
    }

    /**
     * @return {boolean}
     */
    shouldStreamToFile() {
        return this.outputPath !== null;
    }

    /**
     * @return {boolean}
     */
    shouldStreamFromFile() {
        return this.inputPath !== null;
    }

    /**
     * Set the data to put as string
     *
     * @param {string|{}} data
     * @return {this}
     */
    setData(data) {
        this.data = data;
        return this;
    }

    /**
     * Set a file as input file for the request body
     *
     * @param {string} inputPath
     * @return {this}
     */
    setInputPath(inputPath) {
        this.inputPath = inputPath;
        return this;
    }
}

module.exports = Request;