import { NextFunction, Request, Response } from 'express';
import { apiResponse } from '../utils/apiResponse';
import { ApiResponseInterface } from '../interface/ApiResponseInterface';
import { CustomError } from '../errors/CustomError';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errStatus = 500;
  const message: string = err.message || 'Something went wrong';

  if (err instanceof CustomError) {
    const { statusCode, errors, logging } = err;
    const data: ApiResponseInterface = {
      res,
      message,
      code: statusCode,
      err,
      errors,
      success: false,
    };

    return apiResponse(data);
  }

  const data: ApiResponseInterface = {
    res,
    message,
    code: errStatus,
    err,
    errors: [
      {
        msg: message,
      },
    ],
    success: false,
  };

  console.log(err);

  return apiResponse(data);
};
export default errorHandler;