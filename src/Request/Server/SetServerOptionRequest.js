const GetServerOptionsRequest = require('./GetServerOptionRequest');

class SetServerOptionRequest extends GetServerOptionsRequest {
    method = "POST";

    /**
     * SetServerOptionRequest constructor
     *
     * @param {string} id
     * @param {string} option
     * @param value
     */
    constructor(id, option, value) {
        super(id, option);
        this.data = {};
        this.data[option] = value;
    }
}

module.exports = SetServerOptionRequest;