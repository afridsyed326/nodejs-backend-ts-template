# This repository serves as a comprehensive Node.js backend template equipped with essential features and configurations to kickstart your development process. Below, you'll find instructions on setting up the project environment, along with details on environment variables and commands for both development and production environments.

### Requirements
- **nodejs version > 18.0**
- **mongodb version > 6.0 with minimum 2 replica sets**
- **gcloud storage** (optional)

### To set up the project for development:

1. Clone the repository: git clone https://github.com/afridsyed326/nodejs-backend-ts-template.git.
2. Install dependencies: npm install.
3. Create a .env file based on the provided .env.example.
4. Set up environment variables in the .env file according to your configuration.
5. Start the development server: npm run dev.


## Env explained
- `JWT_PRIVATE_KEY_USER` your jwt secret
- `EXPRESS_SESSION_SECRET` your express secret
- `PORT` - port on which the backend will run on the server
- `MONGODB_URL` mongodb connection string. ex: *mongodb://localhost:27017/*
- `DB_NAME` name of the database
- `ADMIN_EMAIL` admin emails to auto set the user admin upon reguistering. must be a string of emails seperated by `,` 
- `GC_BUCKET_NAME` name of google cloud storage bucket
- `FRONTEND_LINK` url where frontend is deployed
- `BACKEND_LINK` url of this backend
- `SMTP_HOST` SMTP Email hostname
- `SMTP_USER` SMTP email username
- `SMTP_PASSWORD`  SMTP email password
- `PROJECT_NAME` project name used in emails

### If you want to use google storage
Replace the `service_account.json` file with your google cloud service_account file in root directory


Feel free to explore the codebase, customize configurations, and leverage the provided features to accelerate your backend development process. Should you have any questions or need assistance, please refer to the documentation or reach out to the project maintainers.

Author: SM Afrid
Email: afridsyed935@gmail.com


