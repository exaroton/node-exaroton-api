import GetServerPropertiesRequest from './GetServerPropertiesRequest.js'

export default class SetServerPropertiesRequest extends GetServerPropertiesRequest {
    method = "POST";

    /**
     * SetServerPropertiesRequest constructor
     *
     * @param {string} id
     * @param {Object.<string, string|number|boolean>} properties
     */
    constructor(id, properties) {
        super(id);
        this.data = properties;
    }
}
