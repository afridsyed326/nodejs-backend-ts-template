# Requirements
- **nodejs version > 18.0**
- **mongodb version > 6.0 with minimum 2 replica sets**
- **gcloud storage**

## Deployment steps

### 1. Clone the repository
### 2. Create **.env** file in root folder and paste the content from *.example.env*
### 3. Replace the keys in .env files with production keys
- `JWT_PRIVATE_KEY_USER` your jwt secret
- `EXPRESS_SESSION_SECRET` your express secret
- `PORT` - port on which the backend will run on the server
- `MONGODB_URL` mongodb connection string. ex: *mongodb://localhost:27017/*
- `DB_NAME` name of the database
- `ADMIN_EMAIL` admin emails to auto set the user admin upon reguistering. must be a string of emails seperated by `,` 
- `GC_BUCKET_NAME` name of google cloud storage bucket
- `FRONTEND_LINK` url where frontend is deployed
- `BACKEND_LINK` url of this backend

### 4. Go to `/src/service/sendEmail.routes.ts` change the email smtp config according to your email provider.

### 5. Replace the `service_account.json` file with your google cloud service_account file

### 6. Paste the users csv file in the root folder with exact name `users.csv`

##### Expected Users CSV file format:-
`| username | email | omega_id | first_name | last_name | date_joined | country | AUSD | PUSD | XPL | USDT |`
*The country must be the international code of the countries* 
    
### 7. Run the dev server to check everything is set up 
>`npm install`
>`npm run dev`

### 8. If everything is well, stop the dev server.
### 9. Run the script to populate the database with all the required data. 
**Please check the `/scripts` folder which contains all the scripts to populate the database with default values. If there is a need to change any default values, please do so before proceeding forward with this step.**
**It is advised to run the scripts with real users data in a test environment and test database before going in to the production**
>`npm run script`
    - Input 'y' to all the question asked
### 10. After successfully running the script, finish the deployment by running 
`npm run build`
`npm start`
### 11. expose the port to the backend url


-------------

## How to enable replica set in mongodb (Linux server)
##### *Note: This procedure only works if there is already one instance of mongodb running. And this procedure may not work for some configs. It is best that you follow mongodb docs to install replica sets.*

### step 1: Install mongo
### step 2: `sudo nano /etc/mongod.conf`
##### Uncomment replication and add

	replication:
		replSetName: rs1

### step 3: Restart mongo service
`> sudo systemctl restart mongod`
check status `sudo systemctl status mongod` . If inactive, you might have to kill temp mongo socket using `sudo rm /tmp/mongodb-27017.sock` and also update mongo permissions by running below commands.

	sudo chown -R mongodb:mongodb /var/lib/mongodb
	sudo chmod -R 755 /var/lib/mongodb
	sudo systemctl restart mongod

### step 4: open mongo shell `mongosh`
	> rs.initiate()
	> rs.add("127.0.0.1:27018")
	> rs.status() 

> look in the members array, you will see multiple mongo instances

##### Repeat the above steps to add more replication sets
