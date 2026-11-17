/**
 * A page of a paginated list
 *
 * @template T
 */
export default class Page {
    /**
     * Items on this page
     *
     * @type {T[]}
     */
    items = [];

    /**
     * The requested page, starting at 1
     *
     * @type {number}
     */
    page;

    /**
     * The last page with items (at least 1)
     *
     * @type {number}
     */
    lastPage;

    /**
     * Total number of items in all pages
     *
     * @type {number}
     */
    total;

    /**
     * Map raw object to this instance, except for the items
     *
     * @param {{}} pageObject
     * @return {this}
     */
    setFromObject(pageObject) {
        this.page = typeof pageObject.page !== "undefined" ? pageObject.page : null;
        this.lastPage = typeof pageObject.lastPage !== "undefined" ? pageObject.lastPage : null;
        this.total = typeof pageObject.total !== "undefined" ? pageObject.total : null;
        return this;
    }

    /**
     * Check if there is a page after this one
     *
     * @return {boolean}
     */
    hasNextPage() {
        return this.page < this.lastPage;
    }
}
