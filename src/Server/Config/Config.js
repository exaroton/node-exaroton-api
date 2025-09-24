import GetConfigFileOptionsRequest from '../../Request/Server/Files/Config/GetConfigFileOptionsRequest.js'
import UpdateConfigFileOptionsRequest from '../../Request/Server/Files/Config/UpdateConfigFileOptionsRequest.js'
import ConfigOption from './ConfigOption.js'

export default class Config {
    /**
     * @type {File}
     */
    #file;

    /**
     * @type {null|Map<string, ConfigOption>}
     */
    #options = null;

    /**
     * @type {null|Map<string, ConfigOptionValue>}
     */
    #originalValues = null;

    /**
     * @param {File} file
     */
    constructor(file) {
        this.#file = file;
    }

    /**
     * @param {Object} object
     * @return {this}
     */
    applyData(object) {
        this.#options = new Map();
        this.#originalValues = new Map();

        if (!Array.isArray(object)) {
            return this;
        }

        for (const option of object) {
            if (typeof option !== "object") {
                continue;
            }

            let {key, label, type, value, options} = option;
            if (typeof key !== "string" || typeof label !== "string" || typeof type !== "string" || options && !Array.isArray(options)) {
                continue;
            }

            this.#options.set(key, new ConfigOption(key, label, type, value, options));
            this.#originalValues.set(key, value);
        }
        return this;
    }

    /**
     * @return {Promise<this>}
     */
    async #loadOptions() {
        const response = await this.#file.getClient().request(new GetConfigFileOptionsRequest(this.#file.getServer().id, this.#file.path));
        this.applyData(response.getData());
        return this;
    }

    /**
     * @param {boolean} update
     * @return {Promise<Map<string, ConfigOption>>}
     */
    async getOptions(update = false) {
        if (update || this.#options === null) {
            await this.#loadOptions();
        }
        return this.#options;
    }

    /**
     * @param {string} key
     * @return {Promise<ConfigOption|null>}
     */
    async getOption(key) {
        const options = await this.getOptions();
        return options.get(key) ?? null;
    }

    /**
     * Save all changes made to this config file
     *
     * @return {Promise<Response|null>} null if no changes were made
     */
    async save() {
        let updated = false;
        let changed = {};
        for (let [key, option] of this.#options) {
            if (option.getValue() !== this.#originalValues.get(key)) {
                updated = true;
                changed[key] = option.getValue();
            }
        }

        if (!updated) {
            return null;
        }

        let response = await this.#file.getClient().request(
            new UpdateConfigFileOptionsRequest(this.#file.getServer().id, this.#file.path, changed));

        for (let [key, value] of Object.entries(changed)) {
            this.#originalValues.set(key, value);
        }

        return response;
    }
}
