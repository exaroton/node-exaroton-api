
class Players {
    /**
     * Max amount of players / slots
     *
     * @type {int}
     */
    max;

    /**
     * Current amount of players
     *
     * @type {number}
     */
    count = 0;

    /**
     * List of player names
     *
     * @type {[string]}
     */
    list = [];

    /**
     * Players constructor
     *
     * @param {{}} playersObject
     */
    constructor(playersObject) {
        this.max = typeof playersObject.max !== "undefined" ? playersObject.max : null;
        this.count = typeof playersObject.count === "number" ? playersObject.count : 0;
        this.list = typeof playersObject.list === "object" ? playersObject.list : [];
    }
}

module.exports = Players;