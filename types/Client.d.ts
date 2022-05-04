import { Account } from "./Account/Account";
import { Request } from "./Request/Request";
import { Response } from "./Response/Response";
import { Server } from "./Server/Server";

export class Client {
  public protocol: string | "https";

  public host: string | "api.exaroton.com";

  public basePath: string | "/v1";

  /**
   * API base URL used for all requests
   *
   * @returns {string}
   */
  public get baseUrl(): string;

  /**
   * API token used for authentication
   *
   * @private
   */
  private apiToken: string | null;

  /**
   * User agent sent with all requests
   *
   * @private
   */
  private userAgent: string;

  /**
   *
   * @param {string} apiToken string API token, create one here: https://exaroton.com/account/
   * @constructor
   * @constructs Client
   */
  constructor(apiToken: string);

  /**
   * Set the API token
   *
   * @param {string} apiToken
   * @returns {Client}
   */
  public setAPIToken(apiToken: string): string;

  /**
   * @returns {string}
   */
  public getAPIToken(): string;

  /**
   * Set the user agent
   *
   * @param {string} userAgent
   * @returns {Client}
   */
  public setUserAgent(userAgent: string): Client;

  /**
   * Send a {Request} to the API and get a {Response}
   *
   * @param {Request} request
   * @returns {Promise<Response>}
   * @throws {RequestError}
   */
  public request(request: Request): Promise<Response>;

  /**
   * Get a list of all servers
   *
   * @returns {Promise<Server[]>}
   * @throws {RequestError}
   */
  public getServers(): Promise<Server[]>;

  /**
   * Get account info for the current account
   *
   * @returns {Promise<Account>}
   * @throws {RequestError}
   */
  public getAccount(): Promise<Account>;

  /**
   * Initialize a new server object
   *
   * @param {string} id
   * @returns {Server}
   */
  public server(id: string): Server;
}
