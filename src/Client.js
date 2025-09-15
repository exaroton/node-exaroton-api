import {unlink} from 'fs/promises'

import Server from './Server/Server.js'
import Account from './Account/Account.js'
import RequestStatusError from './Error/RequestStatusError.js'
import RequestBodyError from './Error/RequestBodyError.js'
import GetServersRequest from './Request/GetServersRequest.js'
import GetPoolsRequest from './Request/Billing/Pool/GetPoolsRequest.js'

import packageConfig from '../package.json' with { type: 'json' }
import Pool from './Billing/Pool/Pool.js'
import * as stream from "node:stream";
import RequestError from "./Error/RequestError.js";

export default class Client {
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

        /** @type {RequestInit} */
        const options = {
            method: request.method,
            headers: Object.assign({
                "authorization": "Bearer " + this.#apiToken,
                "user-agent": this.#userAgent
            }, request.headers)
        }

        if (request.hasBody()) {
            options.body = request.getBody();
        }

        let response;
        try {
            response = await fetch(url, options);
            if (!response.ok) {
                let data = null;
                try {
                    data = await response.json();
                } catch (e) { }
                throw new RequestStatusError(response, data)
            }
            if (request.hasOutputStream()) {
                await response.body.pipeTo(stream.Writable.toWeb(request.getOutputStream()))
                return request.createResponse();
            }
        } catch (e) {
            if (request.outputPath !== null) {
                try {
                    await unlink(request.outputPath);
                } catch (e) {
                    // ignore
                }
            }

            if (e instanceof RequestError) {
                throw e;
            }
            throw new RequestError(e);
        }

        if (request.expectsJsonResponse()) {
            const data = await response.json();
            if (data.success) {
                return request.createResponse(data);
            }

            throw new RequestBodyError(response, data);
        }

        return request.createResponse(await response.text());
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
     * Get a list of all credit pools
     *
     * @return {Promise<Pool[]>}
     * @throws {RequestError}
     */
    async getPools() {
        return (await this.request(new GetPoolsRequest)).getData();
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

    /**
     * Initialize a new pool object
     *
     * @param {string} id
     * @return {Pool}
     */
    pool(id) {
        return new Pool(this, id);
    }
}
