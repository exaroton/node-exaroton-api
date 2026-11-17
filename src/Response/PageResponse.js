import Response from './Response.js'
import Page from '../Page/Page.js'

/**
 * @abstract
 */
export default class PageResponse extends Response {
    /**
     * @type {Page}
     */
    page;

    /**
     * @inheritDoc
     */
    setBody(body) {
        super.setBody(body);

        this.page = this.createPage();
        if (typeof body?.data !== "object" || body.data === null) {
            return;
        }

        this.page.setFromObject(body.data);
        if (Array.isArray(body.data.items)) {
            for (let object of body.data.items) {
                this.page.items.push(this.handleItem(object));
            }
        }
    }

    /**
     * Create the page object
     *
     * @return {Page}
     */
    createPage() {
        return new Page();
    }

    /**
     * @param {*} item
     * @return {*}
     * @abstract
     */
    handleItem(item) {

    }

    /**
     * @inheritDoc
     * @return {Page}
     */
    getData() {
        return this.page;
    }
}
