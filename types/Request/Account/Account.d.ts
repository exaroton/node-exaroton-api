import { Request } from "../Request";

export class GetAccountRequest extends Request {
  public endpoint: "account/" | string;
}
