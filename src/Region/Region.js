
export default class Region {
    /**
     * Unique region ID (e.g. "eu")
     *
     * @type {string}
     */
    id;

    /**
     * Display name of the region (e.g. "Europe")
     *
     * @type {string}
     */
    name;

    /**
     * Region constructor
     *
     * @param {{}} regionObject
     */
    constructor(regionObject) {
        this.id = typeof regionObject.id !== "undefined" ? regionObject.id : null;
        this.name = typeof regionObject.name !== "undefined" ? regionObject.name : null;
    }
}
