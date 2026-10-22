import Software from '../Server/Software.js'
import ArrayResponse from './ArrayResponse.js'

export default class SoftwareResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new Software(item);
    }
}
