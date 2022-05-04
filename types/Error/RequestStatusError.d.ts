import { RequestError } from "./RequestError";

export class RequestStatusError extends RequestError {
  constructor(error: RequestError);
}
