import BackupRequest from './BackupRequest.js'

export default class RestoreBackupRequest extends BackupRequest {
    endpoint = "servers/{id}/backups/{backupId}/restore";
    method = "POST";
}
