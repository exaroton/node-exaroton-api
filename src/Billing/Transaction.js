
export default class Transaction {
    /**
     * Unique transaction ID
     *
     * @type {string}
     */
    id;

    /**
     * Transaction type, e.g. "run", "retention", "payment", "refund", "pool-deposit", "pool-withdraw",
     * "redeem-code" or a compensation ("comp-*")
     *
     * @type {string}
     */
    type;

    /**
     * Credits from the perspective of the account, pool or server the list belongs to:
     * positive for income, negative for usage. Grows while the transaction is active.
     *
     * @type {number}
     */
    credits;

    /**
     * Rate used to calculate the credits, in credits per interval
     *
     * @type {number|null}
     */
    rate;

    /**
     * Interval of the rate in seconds
     *
     * @type {number|null}
     */
    interval;

    /**
     * Factor used to calculate the credits, e.g. the GB of RAM
     *
     * @type {number|null}
     */
    amount;

    /**
     * Whether the transaction is still running (e.g. the server is still online)
     *
     * @type {boolean}
     */
    active;

    /**
     * @type {boolean}
     */
    paid;

    /**
     * Unix timestamp of the start of the transaction
     *
     * @type {number}
     */
    startTime;

    /**
     * Unix timestamp of the end of the transaction, null while it is active
     *
     * @type {number|null}
     */
    endTime;

    /**
     * Account ID of the transaction
     *
     * @type {string|null}
     */
    account;

    /**
     * Credit pool ID of the transaction
     *
     * @type {string|null}
     */
    pool;

    /**
     * Server ID of the transaction
     *
     * @type {string|null}
     */
    server;

    /**
     * Transaction constructor
     *
     * @param {{}} transactionObject
     */
    constructor(transactionObject) {
        this.id = typeof transactionObject.id !== "undefined" ? transactionObject.id : null;
        this.type = typeof transactionObject.type !== "undefined" ? transactionObject.type : null;
        this.credits = typeof transactionObject.credits !== "undefined" ? transactionObject.credits : null;
        this.rate = typeof transactionObject.rate !== "undefined" ? transactionObject.rate : null;
        this.interval = typeof transactionObject.interval !== "undefined" ? transactionObject.interval : null;
        this.amount = typeof transactionObject.amount !== "undefined" ? transactionObject.amount : null;
        this.active = typeof transactionObject.active !== "undefined" ? transactionObject.active : null;
        this.paid = typeof transactionObject.paid !== "undefined" ? transactionObject.paid : null;
        this.startTime = typeof transactionObject.startTime !== "undefined" ? transactionObject.startTime : null;
        this.endTime = typeof transactionObject.endTime !== "undefined" ? transactionObject.endTime : null;
        this.account = typeof transactionObject.account !== "undefined" ? transactionObject.account : null;
        this.pool = typeof transactionObject.pool !== "undefined" ? transactionObject.pool : null;
        this.server = typeof transactionObject.server !== "undefined" ? transactionObject.server : null;
    }
}
