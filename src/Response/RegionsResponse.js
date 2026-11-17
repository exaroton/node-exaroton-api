import ArrayResponse from './ArrayResponse.js'
import Region from '../Region/Region.js'

export default class RegionsResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new Region(item);
    }
}
