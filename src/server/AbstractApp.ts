import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { handleFinalError, logError, sendEmail } from './errorHandlers';
import errorHandler from '../middlewares/error.middleware';
import ErrorHandlingMiddleware from '../interface/ErrorHandlingMiddleware';
import rootRoute from '../routes/index';
import '../cron';

import { ApiResponseInterface } from '../interface/ApiResponseInterface';
import { apiResponse } from '../utils/apiResponse';
import middlewareRoot from '../middlewares/middlewareRoot';

abstract class AbstractApp {
  protected app: Express;
  protected server: http.Server;
  public socketConnection: any;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandlers();
    this.socketConnection = null;
  }
  // Default empty implementations for methods
  protected setupMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(middlewareRoot);
    // add body parser
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use('/', express.static('public'));
  }
  protected setupRoutes(): void {
    this.app.get('/', (req: Request, res: Response) => res.sendFile(__dirname + '/public/index.html'));
    this.app.use('/', rootRoute);
    this.app.use((req, res) => {
      const data: ApiResponseInterface = {
        res,
        message: 'Page Not Found',
        code: 404,
        success: false,
      };
      apiResponse(data);
    });
  }
  protected setupErrorHandlers(): void {
    this.app.use(logError as ErrorHandlingMiddleware); // Use the logError middleware
    this.app.use(sendEmail as ErrorHandlingMiddleware); // Use the sendEmail middleware
    this.app.use(handleFinalError as ErrorHandlingMiddleware); // Use the handleFinalError middleware
    this.app.use(errorHandler);
  }
}

export default AbstractApp;
