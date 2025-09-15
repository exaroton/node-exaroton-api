
export default class PoolMember {
    /**
     * Pool member account ID
     *
     * @type {string}
     */
    account;

    /**
     * Pool member name
     *
     * @type {string}
     */
    name;

    /**
     * Pool member share
     *
     * @type {number}
     */
    share;

    /**
     * Pool member credits
     *
     * @type {number}
     */
    credits;

    /**
     * Is pool owner
     *
     * @type {boolean}
     */
    isOwner;

    /**
     * Pool member constructor
     *
     * @param {{}} poolMemberObject
     */
    constructor(poolMemberObject) {
        this.account = typeof poolMemberObject.account !== "undefined" ? poolMemberObject.account : null;
        this.name = typeof poolMemberObject.name !== "undefined" ? poolMemberObject.name : null;
        this.share = typeof poolMemberObject.share !== "undefined" ? poolMemberObject.share : null;
        this.credits = typeof poolMemberObject.credits !== "undefined" ? poolMemberObject.credits : null;
        this.isOwner = typeof poolMemberObject.isOwner !== "undefined" ? poolMemberObject.isOwner : null;
    }
}
