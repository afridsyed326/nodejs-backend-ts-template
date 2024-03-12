import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { USER_TYPE } from '../models/user.model';
import BadRequestError from '../errors/BadRequestError';
interface DecodedPayload {
  userId: string;
}

const excludeAuth = ['auth'];

const userAuthMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
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
    const decoded = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY_USER || ''
    ) as DecodedPayload;

    //get the user from the token.
    const user = await UserModel.findOne({
      _id: decoded.userId,
      type: USER_TYPE.USER,
    }).select('-password -2faSecret');
    req.user = user;
    req.userId = decoded.userId;

    if (!user) {
      throw new BadRequestError({
        code: 401,
        message: 'Unauthorized',
      });
    }
    next();
  }
};
export default userAuthMiddleware;
