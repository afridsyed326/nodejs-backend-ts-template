import cron from 'node-cron';
import moment from 'moment';
import createDbBackup from '../scripts/dbBackup';

cron.schedule('0 0 * * *', () => {
  createDbBackup();
});
