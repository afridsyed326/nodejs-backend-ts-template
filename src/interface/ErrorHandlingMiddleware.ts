import { Request, Response, NextFunction } from 'express';
export default interface ErrorHandlingMiddleware {
  (err: Error, req: Request, res: Response, next: NextFunction): void;
}
