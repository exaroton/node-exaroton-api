/**
 * @typedef {string|number|boolean|string[]} ConfigOptionValue
 */

export default class ConfigOption {
    /**
     * Key of this config option
     *
     * @type {string}
     */
    #key;

    /**
     * Label of this config option
     *
     * @type {string}
     */
    #label;

    /**
     * Option type
     *
     * @type {string}
     */
    #type;

    /**
     * Current option value
     *
     * @type {ConfigOptionValue}
     */
    #value;

    /**
     * Available options for select/multiselect
     *
     * @type {string[]|null}
     */
    #options;

    /**
     * ConfigOption constructor
     *
     * @param {string} key
     * @param {string} label
     * @param {string} type
     * @param {ConfigOptionValue} value
     * @param {string[]|null} options
     */
    constructor(key, label, type, value, options = null) {
        this.#key = key;
        this.#label = label;
        this.#type = type;
        this.#value = value;
        this.#options = options;
    }

    /**
     * @return {string}
     */
    getKey() {
        return this.#key;
    }

    /**
     * @return {string}
     */
    getLabel() {
        return this.#label;
    }

    /**
     * @return {string}
     */
    getType() {
        return this.#type;
    }

    /**
     * @return {ConfigOptionValue}
     */
    getValue() {
        return this.#value;
    }

    /**
     * @param {ConfigOptionValue} value
     * @return {ConfigOption}
     */
    setValue(value) {
        this.#value = value;
        return this;
    }

    /**
     * @return {string[]|null}
     */
    getOptions() {
        return this.#options;
    }
}
