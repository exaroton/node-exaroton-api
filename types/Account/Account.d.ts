import { Client } from "../Client";

export class Account {
  /**
   * @private
   */
  private client: Client;

  /**
   * Username
   */
  public name: string;

  /**
   * Email address
   */
  public email: string;

  /**
   * Email address verification
   */
  public verified: boolean;

  /**
   * The amount of credits currently available
   */
  public credits: number;

  /**
   * Account constructor
   *
   * @param {Client} client
   * @constructor
   */
  constructor(client: Client);

  /**
   * Get/update the account info
   *
   * @returns {Promise<Account>}
   * @throws {RequestError}
   */
  public get(): Promise<Account>;

  /**
   * Map raw objects to this instance
   *
   * @param {object} account
   * @returns {Account}
   */
  public setFromObject(account: object): Account;
}
