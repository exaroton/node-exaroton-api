import { Response } from "got/dist/source";

export class RequestError extends Error {
  public statusCode: number;
  public response: Response;

  /**
   * Set error and status code from response object
   *
   * Returns if an error message was found
   *
   * @param {object} response
   * @returns {boolean}
   */
  setErrorFromResponseBody(response: object): boolean;
}
