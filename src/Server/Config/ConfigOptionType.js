/**
 * @enum {string}
 */
class ConfigOptionType {
    static STRING = "string";
    static INTEGER = "number";
    static FLOAT = "float";
    static BOOLEAN = "boolean";
    static MULTI_SELECT = "multiselect";
    static SELECT = "select";
}

module.exports = ConfigOptionType;
