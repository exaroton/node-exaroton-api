import FormData = require("form-data");
import { Response, ServersResponse } from "../Response/Response";

type Method = "GET" | "POST" | "PUT" | "DELETE";

export class Request {
  /**
   * Request method, e.g. "GET" or "POST"
   */
  public method: Method;

  /**
   * Endpoint URL, without base, version or starting /
   */
  public endpoint: string;

  /**
   * URL parameters, which are replaced in the endpoint string
   */
  public parameters: object;

  /**
   * HTTP request headers
   */
  public headers: object;

  /**
   * Post body data
   */
  public data: null | object;

  /**
   * Response class used to create/parse responses to this request
   *
   * @type {Response}
   */
  public responseClass: Response;

  /**
   * Set a URL parameter
   *
   * URL parameters replace {key} variables in the endpoint URL
   *
   * @param {string} key
   * @param {string} value
   */
  public setParameter(key: string, value: string): void;

  /**
   *
   * @param {string} key
   * @param {string} value
   */
  public setHeader(key: string, value: string): void;

  /**
   * Get endpoint with replaced parameters
   *
   * @return {string}
   */
  public getEndpoint(): string;

  /**
   * Check if the request has a body
   *
   * @return {boolean}
   */
  public hasBody(): boolean;

  /**
   * Get body for request
   *
   * @return {FormData|string}
   */
  public getBody(): FormData | string;

  /**
   * Create a response object for this request
   *
   * @param {{}} body
   * @return {Response}
   */
  public createResponse(body: object): Response;
}

export class GetServersRequest extends Request {
  endpoint: string;
  responseClass: ServersResponse;
}
