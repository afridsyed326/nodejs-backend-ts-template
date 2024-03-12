// MODULE IMPORTS
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

// UTILS
import BadRequestError from '../errors/BadRequestError';

// MIDDLEWARES
export const validationCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new BadRequestError({
      errors: result.array(),
    });
  }
  next();
};
