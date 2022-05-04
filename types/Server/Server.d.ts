import { EventEmitter } from "node:events";
import { Client } from "../Client";
import { Response } from "../Response/Response";
import { WebsocketClient } from "../Websocket/WebsocketClient";

export enum ServerStatus {
  OFFLINE = 0,
  ONLINE = 1,
  STARTING = 2,
  STOPPING = 3,
  RESTARTING = 4,
  SAVING = 5,
  LOADING = 6,
  CRASHED = 7,
  PENDING = 8,
  PREPARING = 10,
}

export interface Server {
  id: string;
  name: string;
  address: string;
  motd: string;
  status: ServerStatus;
  host: string | null;
  port: number | null;
  shared: boolean;
  software: Software;
  players: PlayerList[];
}

export interface Software {
  id: string;
  name: string;
  version: string;
}

export class PlayerList {
  /**
   * List name / identifier
   */
  public name: string;

  private server: Server;
  private client: Client;

  /**
   * @param {string} name
   * @constructor
   * @constructs PlayerList
   */
  constructor(name: string);

  /**
   * Set the server for this list
   *
   * @param server
   * @returns {PlayerList}
   */
  public setServer(server: Server): PlayerList;

  /**
   * Set the API client
   *
   * @param {Client} client
   * @returns {PlayerList}
   */
  public setClient(client: Client): PlayerList;

  /**
   * Get the list name
   *
   * @returns {string}
   */
  public getName(): string;

  /**
   * @returns {Promise<string[]>}
   */
  public getEntries(): Promise<string[]>;

  /**
   * Add multiple entries
   *
   * @param {string[]} entries
   * @returns {Promise<Response>}
   */
  public addEntries(entries: string[]): Promise<Response>;

  /**
   * Add a single entry
   *
   * @param {string} entry
   * @returns {Promise<Response>}
   */
  public addEntry(entry: string): Promise<Response>;

  /**
   * Delete multiple entries
   *
   * @param {string[]} entries
   * @returns {Promise<Response>}
   */
  public deleteEntries(entries: string[]): Promise<Response>;

  /**
   * Delete a single entry
   *
   * @param {string} entry
   * @returns {Promise<*>}
   */
  public deleteEntry(entry: string): Promise<Response>;
}

export class Players {
  /**
   * Max amount of players / slots
   */
  public max: number;

  /**
   * Current amount of players
   */
  public count: number;

  /**
   * List of player names
   *
   * @type {[string]}
   */
  public list: string[];

  /**
   * Players constructor
   *
   * @param {Players} playersObject
   */
  constructor(playersObject: Players);
}

export class Server extends EventEmitter {
  /**
   * Shorthand to get server status constants
   *
   * @return {ServerStatus}
   */
  get STATUS(): ServerStatus;

  private client: Client;

  /**
   * Unique server ID
   */
  public id: string;

  /**
   * Server name
   */
  public name: string;

  /**
   * Full server address (e.g. example.exaroton.me)
   */
  public address: string;

  /**
   * MOTD
   */
  public motd: string;

  /**
   * Server status
   * @see ServerStatus
   */
  public status: ServerStatus;

  /**
   * Host address, only available if the server is online
   */
  public host: string | null;

  /**
   * Server port, only available if the server is online
   */
  public port: number | null;

  /**
   * Check if this is an owned or shared server
   */
  public shared: false | boolean;

  /**
   * Server software
   */
  public software: Software;

  /**
   * Player lists
   */
  private playerLists: PlayerList[];

  /**
   * Server constructor
   *
   * @param {Client} client
   * @param {string} id
   * @constructor
   * @constructs Server
   */
  constructor(client: Client, id: string);

  public getClient(): Server;

  /**
   * Get/update the server info
   *
   * @return {Promise<this>}
   * @throws {RequestError}
   */
  public get(): Promise<Server>;

  /**
   * Start the server
   *
   * @return {Promise<Response>}
   * @throws {RequestError}
   */
  public start(): Promise<Response>;

  /**
   * Stop the server
   *
   * @return {Promise<Response>}
   * @throws {RequestError}
   */
  public stop(): Promise<Response>;

  /**
   * Restart the server
   *
   * @return {Promise<Response>}
   * @throws {RequestError}
   */
  public restart(): Promise<Response>;

  /**
   * Execute a command in the server console
   *
   * @param {string} command
   * @return {Promise<Response|boolean>}
   */
  public executeCommand(command: string): Promise<Response | boolean>;

  /**
   * Get the content of the server logs
   *
   * This is cached and will not return the latest updates immediately.
   *
   * @returns {Promise<string>}
   */
  public getLogs(): Promise<string>;

  /**
   * Upload the content of the server logs to mclo.gs
   *
   * Returns the URL of the logs on mclo.gs
   *
   * @returns {Promise<string>}
   */
  public shareLogs(): Promise<string>;

  /**
   * Get the assigned max server RAM in GB
   *
   * @return {Promise<int>}
   */
  public getRAM(): Promise<number>;

  /**
   * Set the assigned max server RAM in GB
   *
   * @param {int} ram
   * @return {Promise<Response>}
   */
  public setRAM(ram: number): Promise<Response>;

  /**
   * Get the server MOTD
   *
   * @returns {Promise<string>}
   */
  public getMOTD(): Promise<string>;

  /**
   * Set the server MOTD
   *
   * @param {string} motd
   * @returns {Promise<Response>}
   */
  public setMOTD(motd: string): Promise<Response>;

  /**
   * Get a server option
   *
   * @param option
   * @return {Promise<*>}
   */
  public getOption(option: string): Promise<any>;

  /**
   * Set a server option
   *
   * @param option
   * @param value
   * @return {Promise<Response>}
   */
  public setOption(option: string, value: string): Promise<Response>;

  /**
   * Get all player lists available for the server
   *
   * @returns {Promise<PlayerList[]>}
   */
  public getPlayerLists(): Promise<PlayerList[]>;

  /**
   * Get a player list by name
   *
   * @param name
   * @returns {PlayerList}
   */
  public getPlayerList(name: string): PlayerList;

  /**
   * Check if the server has one or one of multiple status codes
   *
   * Use this.STATUS.<STATUS> for status codes
   *
   * @param {int|int[]} status
   */
  public hasStatus(status: ServerStatus | ServerStatus[]): boolean;

  /**
   * Get a websocket client for this server
   *
   * @return {WebsocketClient}
   */
  public getWebsocketClient(): WebsocketClient;

  /**
   * Subscribe to one or multiple streams
   *
   * @return {boolean}
   * @param {string[]|string} [streams]
   */
  public subscribe(streams: string[] | string): boolean;

  /**
   * Unsubscribe from one, multiple or all streams
   *
   * @param {string[]|string} [streams]
   */
  public unsubscribe(streams: string[] | string): boolean;

  /**
   * Map raw object to this instance
   *
   * @param {{}} server
   * @return {this}
   */
  public setFromObject(server: object): Server;

  /**
   * Only return intended public fields for JSON serialization
   *
   * Otherwise, fields inherited from EventEmitter would be serialized as well
   *
   * @returns {{}}
   */
  public toJSON(): Server;
}

export class Software {
  /**
   * Software ID
   */
  public id: string;

  /**
   * Software name
   */
  public name: string;

  /**
   * Software version
   */
  public version: string;

  /**
   * Software constructor
   *
   * @param {Software} softwareObject
   * @constructor
   * @constructs Software
   */
  constructor(softwareObject: Software);
}
