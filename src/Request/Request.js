const FormData = require('form-data');
const {createReadStream} = require('fs');
const {createWriteStream} = require("fs");

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
     * Optional stream to stream the response body to
     *
     * @type {stream.Writable|null}
     */
    outputStream = null;

    /**
     * Optional path to read the request body from
     *
     * @type {string|null}
     */
    inputPath = null;

    /**
     * Optional stream to read the request body from
     *
     * @type {stream.Readable|null}
     */
    inputStream = null;

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
        return ["POST", "PUT", "DELETE"].includes(this.method) && (this.data !== null || this.inputPath !== null || this.inputStream !== null);
    }

    /**
     * Get body for request
     *
     * @return {FormData|string|ReadStream}
     */
    getBody() {
        if (this.hasInputStream()) {
            return this.getInputStream();
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
    createResponse(body = null) {
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
     * @return {null|stream.Writable}
     */
    getOutputStream() {
        if (this.outputStream !== null) {
            return this.outputStream;
        }
        if (this.outputPath !== null) {
            return createWriteStream(this.outputPath);
        }
        return null;
    }

    /**
     * @return {boolean}
     */
    hasOutputStream() {
        return this.outputStream !== null || this.outputPath !== null;
    }

    /**
     * @return {null|stream.Readable}
     */
    getInputStream() {
        if (this.inputStream !== null) {
            return this.inputStream;
        }
        if (this.inputPath !== null) {
            return createReadStream(this.inputPath);
        }
        return null;
    }

    /**
     * @return {boolean}
     */
    hasInputStream() {
        return this.inputStream !== null || this.inputPath !== null;
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

    /**
     * Set a file as output file for the response body
     *
     * @param {string} outputPath
     * @return {this}
     */
    setOutputPath(outputPath) {
        this.outputPath = outputPath;
        return this;
    }

    /**
     * Set a stream as input stream for the request body
     *
     * @param {stream.Readable} inputStream
     * @return {this}
     */
    setInputStream(inputStream) {
        this.inputStream = inputStream;
        return this;
    }

    /**
     * Set a stream as output stream for the response body
     *
     * @param {stream.Writable} outputStream
     * @return {this}
     */
    setOutputStream(outputStream) {
        this.outputStream = outputStream;
        return this;
    }
}

module.exports = Request;