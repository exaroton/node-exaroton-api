import DomainRequest from './DomainRequest.js'

/**
 * @typedef {Object} DomainOptions
 * @property {"https"} [protocol] Protocol of the domain
 * @property {number} [port] Port of the domain (1-65535)
 */

export default class UpdateDomainRequest extends DomainRequest {
    method = "PUT";

    /**
     * UpdateDomainRequest constructor
     *
     * @param {string} id
     * @param {string} domainId
     * @param {DomainOptions} options
     */
    constructor(id, domainId, options) {
        super(id, domainId);
        this.data = options;
    }
}
