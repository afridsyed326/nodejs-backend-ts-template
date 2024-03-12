import { ExecException, exec } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

export default async function restoreDbBackup(): Promise<void> {
  const folderPath: string = `db_backups/${process.env.DB_NAME}`;

  const command = `mongorestore --uri="${process.env.MONGODB_URL}${process.env.DB_NAME}" ${folderPath}`;

  await exec(command, async (error: ExecException | null, stdout) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log(stdout);
    console.log(`Backup process completed successfully!`);
  });
}

(() => {
  restoreDbBackup();
})();
