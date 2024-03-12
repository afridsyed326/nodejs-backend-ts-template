import dotenv from 'dotenv';
import 'express-async-errors';
import AbstractApp from './AbstractApp';
import SocketIO from './SocketHandler';
import session from 'express-session';
import mongoose, { Mongoose } from 'mongoose';
dotenv.config();
class Application extends AbstractApp {
  protected setupRoutes(): void {
    super.setupRoutes();
  }

  protected setupMiddlewares(): void {
    super.setupMiddlewares();
    // for google passport authentication
    this.app.use(
      session({
        secret: process.env.EXPRESS_SESSION_SECRET || 'default',
        resave: true,
        saveUninitialized: true,
        cookie: { secure: true },
      })
    );
  }

  public runServer(): any {
    this.server.listen(process.env.PORT, () => {
      console.log(`\n🚀 Server is running at http://localhost:${process.env.PORT}`);
    });
    return this.server;
  }

  public getServer(): any {
    return this.server;
  }

  public runSocket(): void {
    this.socketConnection = new SocketIO(this.server);
  }

  public connectMongoDB(): void {
    mongoose
      .connect(process.env.MONGODB_URL!, {
        autoIndex: false,
        dbName: process.env.DB_NAME,
      })
      .then(async (db: Mongoose) => {
        const status = db.connection.readyState;
        if (status === db.STATES.connected) {
          console.log('🚀 MongoDB connected\n');
        }
        // const changeStream = db.connection.watch();
        // changeStream.on('change', (changes) => {
        //   console.log({ changes });
        // });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
}

export default Application;
