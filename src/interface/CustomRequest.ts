import { Request } from 'express';
import { User } from '../models/user.model';

export interface CustomRequest extends Request {
  user?: User;
  userId?: string;
  [x:string]: any
}
