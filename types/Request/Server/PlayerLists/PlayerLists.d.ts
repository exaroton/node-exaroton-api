import { ServerRequest } from "../Server";
import { PlayerListResponse } from "../../../Response/Response";

export class PlayerListRequest extends ServerRequest {
  public endpoint: string;
  constructor(id: string, name: string);
}

export class DeletePlayerListEntriesRequest extends PlayerListRequest {
  public readonly method: "DELETE";
  constructor(id: string, name: string, entries);
}

export class GetPlayerListEntriesRequest extends PlayerListRequest {}

export class GetPlayerListRequest extends ServerRequest {
  public endpoint: string;
  responseClass: PlayerListResponse;
}

export class PutPlayerListEntriesRequest extends PlayerListRequest {
  public readonly method: "PUT";
  constructor(id: string, name: string, entries);
}
