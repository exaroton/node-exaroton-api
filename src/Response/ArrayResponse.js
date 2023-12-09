const Response = require('./Response');

/**
 * @abstract
 */
class ArrayResponse extends Response {
    /**
     * @type {*[]}
     */
    items = [];

    /**
     * @inheritDoc
     */
    setBody(body) {
        super.setBody(body);

        if (!Array.isArray(body.data)) {
            return;
        }

        for (let object of body.data) {
            this.items.push(this.handleItem(object));
        }
    }

    /**
     * @param {*} item
     * @return {*}
     * @abstract
     */
    handleItem(item) {

    }

    /**
     * @inheritDoc
     */
    getData() {
        return this.items;
    }
}

module.exports = ArrayResponse;
