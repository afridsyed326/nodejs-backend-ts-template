import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { User, USER_TYPE } from '../models/user.model';
import BadRequestError from '../errors/BadRequestError';
interface DecodedPayload {
  userId: string;
}

const excludeAuth = ['auth'];

const adminAuthMiddleware = async (req: any, res: Response, next: NextFunction) => {
  //Get token from the header
  if (excludeAuth.includes(req.path.split('/')[1])) {
    next();
  } else {
    var token = req.headers.authorization || null;

    if (!token) {
      throw new BadRequestError({
        code: 400,
        message: 'No token found',
      });
    }
    token = token.slice(7);

    //verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY_USER || '') as DecodedPayload;
      const user = await UserModel.findOne({
        _id: decoded.userId,
        type: USER_TYPE.ADMIN,
      }).select('-password -tfaSecret');
      req.user = user;

      if (!user) {
        throw new BadRequestError({
          code: 401,
          message: 'Unauthorized',
        });
      }
    } catch (err) {
      throw new BadRequestError({
        code: 401,
        message: 'Unauthorized',
      });
    }
    next();
  }
};
export default adminAuthMiddleware;
