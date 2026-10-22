
export default class Software {
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
     * Software type (e.g. "vanilla")
     *
     * @type {string|null}
     */
    type;

    /**
     * Launcher this software belongs to, only set for modpacks that require a specific launcher
     *
     * @type {string|null}
     */
    launcher;

    /**
     * Addon types (e.g. "mod", "plugin") supported by this software, only available for server software
     *
     * @type {string[]|null}
     */
    addons;

    /**
     * Software constructor
     *
     * @param {{}} softwareObject
     */
    constructor(softwareObject) {
        this.id = typeof softwareObject.id !== "undefined" ? softwareObject.id : null;
        this.name = typeof softwareObject.name !== "undefined" ? softwareObject.name : null;
        this.version = typeof softwareObject.version !== "undefined" ? softwareObject.version : null;
        this.type = typeof softwareObject.type !== "undefined" ? softwareObject.type : null;
        this.launcher = typeof softwareObject.launcher !== "undefined" ? softwareObject.launcher : null;
        this.addons = Array.isArray(softwareObject.addons) ? softwareObject.addons : null;
    }
}
