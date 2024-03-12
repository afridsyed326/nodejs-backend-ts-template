import mongoose, { Mongoose } from 'mongoose';
import dotenv from 'dotenv';
import upload_country from './uploadCountry.script';
import * as readline from 'readline';
import createDbBackup from './dbBackup';

dotenv.config();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestionAsync = (question: any) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const askQuestions = async (ques: any) => {
  let yesOrNo = { ...ques }; // Copying the object to prevent mutations
  const keys = Object.keys(yesOrNo);

  for (let i = 0; i < keys.length; i++) {
    const que = keys[i];
    const answer: any = await askQuestionAsync(`Do you want to upload ${que} ? (y/n): `);
    const sanitizedAnswer = answer.trim().charAt(0).toLowerCase();
    if (sanitizedAnswer === 'y') {
      yesOrNo[que] = true;
    }
  }

  return yesOrNo;
};

(async () => {
  try {
    const db: Mongoose = await mongoose.connect(process.env.MONGODB_URL || '', {
      autoIndex: false,
      dbName: process.env.DB_NAME,
    });
    const status = db.connection.readyState;
    if (status === db.STATES.connected) {
      console.log('db is connected db name - ' + db.connection.db.databaseName);
      console.log(db.connection.host);
    }

    let yesOrNo: any = {
      backupDb: false,
      countries: false,
    };

    const answers = await askQuestions(yesOrNo);
    rl.close();

    if (answers.backupDb) await createDbBackup();
    if (answers.countries) await upload_country(true);

    console.log('\n Database populated successfully! \n');
    console.log('\n Database populated successfully! \n');

    process.exit();
  } catch (error) {
    console.log('\n Database population failed :( please drop the db and fix the issues and retry \n');
    console.log('\n Database population failed :( please drop the db and fix the issues and retry \n');
    console.log('\n Database population failed :( please drop the db and fix the issues and retry \n');
    console.log('\n Database population failed :( please drop the db and fix the issues and retry \n');
    console.log('\n ------------------------------------------------ \n');
    console.log(error);
    console.log('\n ------------------------------------------------ \n');
    console.log('\n Database population failed :( please drop the db and fix the issues and retry \n');
    console.log('\n Database population failed :( please drop the db and fix the issues and retry \n');
    console.log('\n Database population failed :( please drop the db and fix the issues and retry \n');
    console.log('\n Database population failed :( please drop the db and fix the issues and retry \n');
    process.exit();
  }
})();
