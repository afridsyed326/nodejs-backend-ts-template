import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { USER_STATUS } from '../models/user.model';
import BadRequestError from '../errors/BadRequestError';
interface DecodedPayload {
  userId: string;
}

const excludeAuth = ['auth', 'util', 'webhook', 'legal-content'];

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  //Get token from the header
  if (excludeAuth.includes(req.path.split('/')[1])) {
    next();
  } else {
    var token = req.headers.authorization || null;

    if (!token) {
      throw new BadRequestError({
        code: 401,
        message: 'No token found',
      });
    }
    token = token.slice(7);

    //verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY_USER || '') as DecodedPayload;
      const user = await UserModel.findOne({
        _id: decoded.userId,
      })
        .select('-password')
        .lean();
      req.user = user;

      if (!user) {
        throw new BadRequestError({
          code: 401,
          message: 'Unauthorized',
        });
      }

      if (user.status !== USER_STATUS.ACTIVE)
        throw new BadRequestError({
          message: 'You are currently blocked from accessing the platform',
        });
    } catch (err) {
      throw new BadRequestError({
        code: 401,
        message: 'Unauthorized',
      });
    }

    next();
  }
};
export default authMiddleware;
