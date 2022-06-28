const got = require('got');
const fs = require("fs").promises;

const Server = require('./Server/Server');
const Account = require('./Account/Account');
const RequestStatusError = require('./Error/RequestStatusError');
const RequestBodyError = require('./Error/RequestBodyError');
const GetServersRequest = require('./Request/GetServersRequest');

const packageConfig = require('../package.json');

class Client {
    /**
     * @type {string}
     */
    protocol = "https";

    /**
     * @type {string}
     */
    host = "api.exaroton.com";

    /**
     * @type {string}
     */
    basePath = "/v1/";

    /**
     * API base URL used for all requests
     *
     * @type {string}
     */
    get baseURL() {
        return this.protocol + "://" + this.host + this.basePath
    }

    /**
     * API token used for authentication
     *
     * @type {string|null}
     * @private
     */
    #apiToken = null;

    /**
     * User agent sent with all requests
     *
     * @type {string}
     * @private
     */
    #userAgent = "node-exaroton-api@" + packageConfig.version;

    /**
     * Client constructor
     *
     * @param {string} apiToken string API token, create one here: https://exaroton.com/account/
     */
    constructor(apiToken) {
        this.setAPIToken(apiToken);
    }

    /**
     * Set the API token
     *
     * @param {string} apiToken
     * @return {this}
     */
    setAPIToken(apiToken) {
        if (typeof apiToken !== "string") {
            throw new TypeError("Invalid API token, expected string, but got " + typeof apiToken);
        }

        this.#apiToken = apiToken;
        return this;
    }

    /**
     * @return {string}
     */
    getAPIToken() {
        return this.#apiToken;
    }

    /**
     * Set the user agent
     *
     * @param {string} userAgent
     * @return {this}
     */
    setUserAgent(userAgent) {
        if (typeof userAgent !== "string") {
            throw new TypeError("Invalid user agent, expected string, but got " + typeof userAgent);
        }

        this.#userAgent = userAgent;
        return this;
    }

    /**
     * Send a {Request} to the API and get a {Response}
     *
     * @param {Request} request
     * @return {Promise<Response>}
     * @throws {RequestError}
     */
    async request(request) {
        request.client = this;
        const url = this.baseURL + request.getEndpoint();
        const headers = Object.assign({
            "authorization": "Bearer " + this.#apiToken,
            "user-agent": this.#userAgent
        }, request.headers);

        let gotOptions = {
            method: request.method,
            retry: 0,
            headers: headers,
            responseType: request.responseType
        };

        if (request.hasBody()) {
            gotOptions.body = request.getBody();
        }

        let response;
        try {
            if (request.hasOutputStream()) {
                await this.streamResponse(url, gotOptions, request.getOutputStream());
                return request.createResponse();
            } else {
                response = await got(url, gotOptions);
            }
        } catch (e) {
            if (request.outputPath !== null) {
                try {
                    await fs.unlink(request.outputPath);
                } catch (e) {
                    // ignore
                }
            }
            throw new RequestStatusError(e);
        }

        if (!request.expectsJsonResponse() || response.body.success) {
            return request.createResponse(response.body);
        } else {
            throw new RequestBodyError(response);
        }
    }

    /**
     * @param {string} url
     * @param {{}} gotOptions
     * @param {stream.Writable} outputStream
     * @return {Promise<unknown>}
     */
    streamResponse(url, gotOptions, outputStream) {
        return new Promise((resolve, reject) => {
            let stream = got.stream(url, gotOptions);
            stream.pipe(outputStream);
            stream.on("error", async (error) => {
                reject(error);
            });
            stream.on("end", resolve);
        });
    }

    /**
     * Get a list of all servers
     *
     * @return {Promise<Server[]>}
     * @throws {RequestError}
     */
    async getServers() {
        return (await this.request(new GetServersRequest)).getData();
    }

    /**
     * Get account info for the current account
     *
     * @throws {RequestError}
     * @returns {Promise<Account>}
     */
    async getAccount() {
        return (await new Account(this).get());
    }

    /**
     * Initialize a new server object
     *
     * @param {string} id
     * @return {Server}
     */
    server(id) {
        return new Server(this, id);
    }
}

module.exports = Client;