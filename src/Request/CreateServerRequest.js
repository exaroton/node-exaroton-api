import Request from './Request.js'

/**
 * @typedef {Object} CreateServerOptions
 * @property {string} name Preferred server name. If it is taken, a random name based on it will be generated.
 * @property {string} [software] ID of the software to install. Takes precedence over softwareType.
 * @property {string} [softwareType] Software type to install the latest version of (e.g. "vanilla")
 * @property {string} [motd] Server MOTD. A default MOTD is generated if this is not set.
 * @property {string} [timezone] IANA time zone identifier (e.g. "Europe/Berlin"). Defaults to UTC.
 * @property {"eu"|"na"} [region] Server region. Chosen automatically based on the timezone if not set.
 */

export default class CreateServerRequest extends Request {
    endpoint = "servers";
    method = "POST";

    /**
     * CreateServerRequest constructor
     *
     * @param {CreateServerOptions} options
     */
    constructor(options) {
        super();
        this.data = options;
    }
}
