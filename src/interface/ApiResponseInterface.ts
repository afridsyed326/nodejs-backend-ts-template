import { Response } from 'express';
export interface ApiResponseInterface {
  res: Response;
  message?: string;
  code?: number;
  err?: Error;
  errors?: any;
  success?: boolean;
  data?: any;
}
