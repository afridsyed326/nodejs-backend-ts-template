import { exec, ExecException } from 'child_process';
import dotenv from 'dotenv';
import {
  deleteFileFromGC,
  uploadFileFromPathToGC,
  uploadFileToGC,
} from '../utils/googleCloud';
import fs from 'fs';
import path from 'path';
dotenv.config();

function formatDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  const year = date.getFullYear();

  return `${day}_${month}_${year}`;
}

function convertToDate(dateString: string): Date | null {
  const dateParts = dateString.split('_').map((part) => parseInt(part, 10));

  // Check if the input string matches the expected format
  if (dateParts.length === 3 && dateParts.every((part) => !isNaN(part))) {
    const [day, month, year] = dateParts;

    // Months in JavaScript's Date object are zero-based, so we subtract 1 from the month
    return new Date(year, month - 1, day);
  } else {
    console.error(
      'Invalid date format. Please provide date in dd_mm_yyyy format.'
    );
    return null;
  }
}

function getDateDifferenceInDays(date1: Date, date2: Date): number {
  const timeDifference = date2.getTime() - date1.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return daysDifference;
}

function deleteDBBackup(folderPath: string): void {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    const dailyRetention = 5;

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      const fileParts = file.split('.');
      const fileDate = convertToDate(fileParts[0]);
      const today = new Date();
      if (fileParts.length < 2 || !fileDate) {
        console.error(`Invalid filename format for file: ${file}`);
        return; // Skip to the next iteration
      }

      const difference = getDateDifferenceInDays(fileDate, today);

      // Check if fileDate is a valid Date object
      if (fileDate instanceof Date && !isNaN(fileDate.getTime())) {
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error('Error getting file stats:', err);
            return;
          }

          if (stats.isFile() && difference > dailyRetention) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Error deleting file:', err);
                return;
              }
              console.log(`File ${file} deleted successfully.`);
            });
            deleteFileFromGC(folderPath + '/' + file);
          }
        });
      } else {
        // If fileDate is not a valid Date, skip to the next iteration
        console.error(`Invalid date format for file: ${file}`);
      }
    });
  });
}

export default async function createDbBackup(): Promise<void> {
  const backupDirectory: string = `${process.cwd()}/db_backups`;

  const command = `mongodump --uri="${process.env.MONGODB_URL}" --out=${backupDirectory}`;

  await exec(command, async (error: ExecException | null) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log(`Backup process completed successfully!`);

    const formattedDate = formatDate();
    const zipCommand = `zip -r db_backups/${formattedDate}.zip ${backupDirectory}/${process.env.DB_NAME}`;
    await exec(zipCommand, (error: ExecException | null) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      console.log(`Zipped completed successfully!`);
    });

    uploadFileFromPathToGC(
      `db_backups/${formattedDate}.zip`,
      `db_backups/${formattedDate}.zip`
    );
  });
  deleteDBBackup('db_backups');
}
