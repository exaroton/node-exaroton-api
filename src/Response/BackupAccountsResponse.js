import ArrayResponse from './ArrayResponse.js'
import BackupAccount from '../Server/Backup/BackupAccount.js'

export default class BackupAccountsResponse extends ArrayResponse {
    /**
     * @inheritDoc
     */
    handleItem(item) {
        return new BackupAccount(item);
    }
}
