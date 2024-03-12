const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const cronJobs = () => {
  fs.readdirSync(__dirname)
    .filter((file: any) => {
      return (
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts'
      );
    })
    .forEach(async (file: any) => {
      try {
        const { default: job } = await import(path.join(__dirname, file));
        job();
      } catch (error: any) {
        console.log(error.message);
      }
    });
};

export default cronJobs;
