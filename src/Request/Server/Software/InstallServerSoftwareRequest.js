import ServerSoftwareRequest from './ServerSoftwareRequest.js'

export default class InstallServerSoftwareRequest extends ServerSoftwareRequest {
    method = "POST";

    /**
     * InstallServerSoftwareRequest constructor
     *
     * @param {string} id
     * @param {string} softwareId
     * @param {boolean} reinstall confirm that all server files will be deleted if a reinstall is required
     */
    constructor(id, softwareId, reinstall = false) {
        super(id, softwareId);
        this.data = {reinstall: reinstall};
    }
}
