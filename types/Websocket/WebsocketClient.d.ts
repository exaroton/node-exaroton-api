import { EventEmitter } from "node:events";
import { Client } from "../Client";
import { Server, ServerStatus } from "../Server/Server";
import { WebSocket } from "ws";

export type Message = "started" | "stopped";

export type StreamStatus = 1 | 2 | 3 | 4;

/**
 * @classdesc Websocket client to connect to the websocket for this server
 */
export class WebsocketClient extends EventEmitter {
  public protocol: "wss" | string;
  private client: Client;
  private server: Server;
  private websocket: WebSocket;

  /**
   * Automatically reconnect in cas of a disconnect
   */
  public autoReconnect: boolean;

  /**
   * Time to wait to reconnect
   *
   * Only change this with caution. A time too low here can
   * cause a spam in requests which can get your application
   * rate limited or even blocked.
   */
  public reconnectTimeout: 3000 | number;

  private reconnectInterval;

  private connected: false | boolean;
  private shouldConnect: false | boolean;
  private serverConnected: false | boolean;
  private ready: false | boolean;
  private streams: Stream[];
  private availableStreams: {
    console: ConsoleStream;
    heap: HeapStream;
    stats: StatsStream;
    tick: TickStream;
  };

  /**
   * @param {Server} server
   * @constructor
   * @constructs WebsocketClient
   */
  constructor(server: Server);

  /**
   * Connect to websocket
   */
  public connect(): void;

  /**
   * Disconnect from the websocket and all streams
   */
  public disconnect(): void;

  public onOpen(): void;

  public onClose(): void;

  public onError(error: Error): boolean;

  public onMessage(rawMessage: string): void;

  public isConnected(): boolean;

  public isReady(): boolean;

  public getServer(): Server;

  public getServerStatus(): Promise<ServerStatus>;

  /**
   * Get a stream by name
   *
   * @param {string} stream
   */
  public getStreams(stream: string): boolean | Stream;

  public hasStream(stream: string): boolean;

  public tryToStartStreams(): void;

  public removeStreams(stream: string): void;

  /**
   * @param stream
   * @param type
   * @param data
   */
  public send(stream: string, type: any, data: any): boolean;
}

export class Stream extends EventEmitter {
  private client: WebsocketClient;
  private started: false | boolean;
  private shouldStart: false | boolean;
  public name: string;
  public startData: object;
  public startStatuses: StreamStatus[];

  /**
   * @param {WebsocketClient} client
   * @constructor
   * @constructs Stream
   */
  constructor(client: WebsocketClient);

  public send(type: any, data: any): boolean;

  /**
   * Status change event
   */
  public onStatusChange(): boolean;

  /**
   * Message event listener
   *
   * @param message
   */
  public onMessage(message: Message): void;

  public onDataMessage(type: string, message: any): void;

  public onDisconnect(): void;

  /**
   * Double event emitter for generic or specific event handling
   *
   * @param type
   * @param data
   */
  public emitEvent(type: string, data: any[]): void;

  /**
   * Start this stream
   */
  public start(data: any): void;

  /**
   * Should/can this stream be started
   */
  public shouldBeStarted(): Promise<boolean>;

  /**
   * Try to start if possible
   */
  public tryToStart(): Promise<void>;

  /**
   * Stop this stream
   */
  public stop(): void;

  /**
   * Try to stop this stream if possible
   */
  public tryToStop(): Promise<boolean>;

  public isStarted(): boolean;
}

export class TickStream extends Stream {
  public name: string;
  public startStatuses: [1];
  public onDataMessage(type: string, message: any): void;
}

export class StatsStream extends Stream {
  public name: string;
  public startStatuses: [1];
}

export class HeapStream extends Stream {
  public name: string;
  public startStatuses: [1];
}

export class ConsoleStream extends Stream {
  private ansiRegex: RegExpConstructor;
  public name: string;
  startData: { tail: 0 };

  public onDataMessage(type: string, message: any): void;

  public parseReturns(string: string): string;

  public parseLine(line: string): string;

  public sendCommand(command: string): void;
}
