import Software from './Software.js'

export default class SoftwareDetails extends Software {
    /**
     * Software description
     *
     * @type {string|null}
     */
    description;

    /**
     * Link with more information about the software
     *
     * @type {string|null}
     */
    link;

    /**
     * Whether installing this software on the server requires a reinstall (deletes all server files)
     *
     * @type {boolean}
     */
    reinstall;

    /**
     * SoftwareDetails constructor
     *
     * @param {{}} softwareObject
     */
    constructor(softwareObject) {
        super(softwareObject);
        this.description = typeof softwareObject.description !== "undefined" ? softwareObject.description : null;
        this.link = typeof softwareObject.link !== "undefined" ? softwareObject.link : null;
        this.reinstall = typeof softwareObject.reinstall !== "undefined" ? softwareObject.reinstall : null;
    }
}
