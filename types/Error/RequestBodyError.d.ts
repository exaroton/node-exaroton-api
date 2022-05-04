import { Response } from "got/dist/source";
import { RequestError } from "./RequestError";

export class RequestBodyError extends RequestError {
  constructor(response: Response);
}
