// MODULE IMPORTS
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// MODELS
import UserModel, { User } from '../models/user.model';
// UTILS
import BadRequestError from '../errors/BadRequestError';
import { getCurrentUserVerification } from '../utils/profileUtils';
import { Request } from 'express';
import axios from 'axios';
import platform from 'platform';
import RecentDeviceModel from '../models/recent-device.model';

const fetchUserData = async (user: User) => {

  const sanitizedUser: any = {
    ...user.toObject(),
    accountType: user.accountType || null,
  };
  delete sanitizedUser.password;
  delete sanitizedUser.tfaSecret;
  delete sanitizedUser.isCompanyDefaultAccount;
  delete sanitizedUser.securityCode;

  // GET KYC & KYB DETAILS
  const userVerification = await getCurrentUserVerification(user._id);

  if (user?.accountType === 'INDIVIDUAL') {
    sanitizedUser.kyc = userVerification;
    delete sanitizedUser.companyName;
    delete sanitizedUser.differentBillingAddress;
    delete sanitizedUser.billingAddress;
  } else if (user?.accountType === 'COMPANY') {
    sanitizedUser.kyb = userVerification;
    sanitizedUser.companyName = user?.companyName ?? '';
    sanitizedUser.differentBillingAddress = user?.differentBillingAddress ?? false;
    sanitizedUser.billingAddress = user?.billingAddress;
  }

  return sanitizedUser;
};

// UTILITY FUNCTIONS
const generateUserJWT = async (query: Object) => {
  const user = await UserModel.findOne({ ...query, deletedAt: null }).populate([
    { path: 'address' },
    { path: 'billingAddress' },
    { path: 'profilePicture', select: 'path' },
  ]);

  if (!user) {
    throw new Error('user not found');
  }

  const sanitizedUser: any = await fetchUserData(user);

  const jwtData = {
    userId: user._id,
    email: user.email,
    username: user.username,
  };

  const token = jwt.sign(jwtData, process.env.JWT_PRIVATE_KEY_USER || '', {
    expiresIn: 60 * 60 * 24,
  });

  return { token, user: sanitizedUser };
};

const generateResetPasswordToken = async (email: String) => {
  const user = await UserModel.findOne({ email, deletedAt: null });

  if (!user) {
    throw new BadRequestError({
      code: 404,
      message: 'User not found',
    });
  }

  const token = jwt.sign({ email }, process.env.JWT_PRIVATE_KEY_USER || '', {
    expiresIn: '1h',
  });
  return token;
};

const verifyResetPasswordToken = async (token: String) => {
  try {
    const decodedToken = jwt.verify(token.toString(), process.env.JWT_PRIVATE_KEY_USER || '');
    return decodedToken;
  } catch (err) {
    throw new BadRequestError({
      code: 401,
      message: 'Token expired, please try again',
    });
  }
};

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const setUserLoginActivity = async (req: Request, user: User, isLogin?: boolean) => {
  // GET USER IP ADDRESS
  let location;
  let ipAddress: any = req.ip;

  try {
    // GET USER LOCATION
    if (req.headers['x-real-ip']) {
      ipAddress = req.headers['x-real-ip'];
    }
    const { data } = await axios.get(`https://ipapi.co/${ipAddress}/json`);
    location = `${data.city}, ${data.country_name}`;
  } catch (error) {
    console.log({ error });

    // send email to admin
    // return;
  }

  // GET USER DEVICE & BROWSER
  // name, os: {family, version}
  const platformDetails = platform.parse(req.headers['user-agent']);

  // TRACKING USER ACTIVITY
  const existingActivity = await RecentDeviceModel.findOne({
    user: user._id,
    ipAddress: ipAddress,
    device: `${platformDetails.os?.family} ${platformDetails.os?.version}`,
    browser: platformDetails.name,
  });

  if (isLogin)

  if (!existingActivity) {
    await RecentDeviceModel.create({
      user: user._id,
      device: `${platformDetails.os?.family} ${platformDetails.os?.version}`,
      browser: platformDetails.name,
      location: location?.includes('undefined') ? '' : location,
      ipAddress: ipAddress,
      timestamp: new Date(),
    });
  } else {
    existingActivity.timestamp = new Date();
    await existingActivity.save();
  }
  return;
};

export {
  generateUserJWT,
  setUserLoginActivity,
  hashPassword,
  generateResetPasswordToken,
  verifyResetPasswordToken,
  fetchUserData,
};
