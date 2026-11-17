import PageResponse from './PageResponse.js'
import Backup from '../Server/Backup/Backup.js'
import BackupPage from '../Server/Backup/BackupPage.js'

export default class BackupPageResponse extends PageResponse {
    /**
     * @inheritDoc
     */
    createPage() {
        return new BackupPage();
    }

    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new Backup(item.id).setFromObject(item).setClient(this.request.client);
    }
}
