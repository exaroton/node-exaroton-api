import { Request } from "../Request/Request";
import { PlayerList, Server } from "../Server/Server";

export class Response {
  public request: Request;

  /**
   * (raw/parsed) response body
   */
  public body: object;

  /**
   * Request constructor
   *
   * @param {Request} request
   * @constructor
   * @constructs Response
   */
  constructor(request: Request);

  /**
   * Get the data from the response
   *
   * @returns {any | null}
   */
  public getData(): any | null;

  /**
   * Set the body to this.body and maybe parse content
   *
   * @param {{}} body
   */
  public setBody(body: object): void;
}

export class PlayerListResponse extends Response {
  public lists: PlayerList[];

  /**
   * @inheritdoc
   */
  setBody(body: object): void;

  /**
   * @inheritdoc
   */
  public getData(): PlayerList[];
}

export class ServersResponse extends Response {
  public servers: Server[];

  /**
   * @inheritdoc
   */
  public setBody(body: object): void;

  /**
   * @inheritdoc
   */
  public getData(): Server[];
}
