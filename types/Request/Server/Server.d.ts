import { Request } from "../Request";

export class ServerRequest extends Request {
  /**
   * Server request constructor
   *
   * @param {string} id
   * @constructor
   * @constructs ServerRequest
   */
  constructor(id: string);
}

export class ExecuteServerCommandRequest extends ServerRequest {
  public endpoint: string;
  public method: "POST";

  /**
   * Server request constructor
   *
   * @param {string} id
   * @param {string} command
   */
  constructor(id: string, command: string);
}

export class GetServerLogsRequest extends ServerRequest {
  public endpoint: string;
}

export class GetServerOptionRequest extends ServerRequest {
  public endpoint: string;

  /**
   * GetServerOptionRequest constructor
   *
   * @param {string} id
   * @param {string} option
   */
  constructor(id: string, option: string);

  /**
   * Set the option name
   * @param {string} option
   */
  public setOption(option: string): void;
}

export class GetServerRequest extends ServerRequest {
  public endpoint: string;
}

export class RestartServerRequest extends ServerRequest {
  public endpoint: string;
}

export class SetServerOptionRequest extends GetServerOptionRequest {
  public method: "POST";

  /**
   * SetServerOptionRequest constructor
   *
   * @param {string} id
   * @param {string} option
   * @param value
   */
  constructor(id: string, option: string, value: any);
}

export class ShareServerLogsRequest extends ServerRequest {
  public endpoint: string;
}

export class StartServerRequest extends ServerRequest {
  public endpoint: string;
}

export class StopSeversRequest extends ServerRequest {
  public endpoint: string;
}
