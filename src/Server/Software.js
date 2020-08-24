
class Software {
    /**
     * Software ID
     *
     * @type {string}
     */
    id;

    /**
     * Software name
     *
     * @type {string}
     */
    name;

    /**
     * Software version
     *
     * @type {string}
     */
    version;

    /**
     * Software constructor
     *
     * @param {{}} softwareObject
     */
    constructor(softwareObject) {
        this.id = typeof softwareObject.id !== "undefined" ? softwareObject.id : null;
        this.name = typeof softwareObject.name !== "undefined" ? softwareObject.name : null;
        this.version = typeof softwareObject.version !== "undefined" ? softwareObject.version : null;
    }
}

module.exports = Software;