import Request from '../Request.js'
import SoftwareResponse from '../../Response/SoftwareResponse.js'

export default class GetSoftwareRequest extends Request {
    endpoint = "software";
    responseClass = SoftwareResponse;

    /**
     * GetSoftwareRequest constructor
     *
     * @param {string|null} type only list software of this type (e.g. "vanilla")
     * @param {string|null} launcher only list modpacks of this launcher (e.g. "CurseForge")
     */
    constructor(type = null, launcher = null) {
        super();
        if (type !== null) {
            this.setQueryParameter("type", type);
        }
        if (launcher !== null) {
            this.setQueryParameter("launcher", launcher);
        }
    }
}
