// MODULE IMPORTS
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

// UTILS
import { apiResponse } from '../utils/apiResponse';
import {
  hashPassword,
  fetchUserData,
  generateResetPasswordToken,
  generateUserJWT,
  setUserLoginActivity,
  verifyResetPasswordToken,
} from '../service/auth.service';
import { checkDuplicateUser, getUser } from '../service/user.service';
import BadRequestError from '../errors/BadRequestError';
import generateOTP from '../utils/generateOTP';

// MODELS
import UserModel, { ACCOUNT_TYPE, USER_STATUS, USER_TYPE, User } from '../models/user.model';
import VerificationCodeModel, { VERIFICATION_CODE_TYPE } from '../models/verification-code.model';

import AddressModel, { ADDRESS_TYPE } from '../models/address.model';
import EmailSender from '../service/sendEmail.service';
import { CustomRequest } from '../interface/CustomRequest';

// TYPES
export type USER_SIGNUP_TYPE = {
  username: String;
  email: string;
  referralCode: String;
  password: String;
  confirmPassword?: String;
  accountType: string;
};

export type USER_LOGIN_TYPE = {
  email: string;
  password: string;
  userActivity: {
    device: string;
    browser: string;
    location: string;
    ipAddress: string;
  };
};

export const signUp = async (req: Request, res: Response) => {
  const { username, email, referralCode, password, accountType }: USER_SIGNUP_TYPE = req.body;

  // CHECKING IF USER WITH CURRENT EMAIL IS ALREADY REGISTERED OR NOT
  await checkDuplicateUser(email, username);

  // IF USER IS NOT ALREADY REGISTERED
  // HASH THE PASSWORD
  const hashPass = await hashPassword(password.toString());

  if (accountType !== ACCOUNT_TYPE.COMPANY && accountType !== ACCOUNT_TYPE.INDIVIDUAL) {
    throw new BadRequestError({
      message: 'Invalid Account Type',
    });
  }

  let isAdmin = false;
  const adminEmails: string[] = (process.env.ADMIN_EMAIL || '').split(',');
  if (adminEmails?.includes(email)) isAdmin = true;

  const refParent = await UserModel.findOne({ refCode: referralCode });
  if (!refParent && !isAdmin) throw new BadRequestError({ message: 'invalid referralCode' });

  // CREATING USER
  const newUser = await UserModel.create({
    username,
    accountType,
    email,
    type: isAdmin ? USER_TYPE.ADMIN : USER_TYPE.USER,
    refParent: refParent?._id,
    password: hashPass,
  });

  // INITIALIZING ADDRESS FOR INDIVIDUAL/COMPANY
  const address = await AddressModel.create({
    addressType: accountType,
  });
  newUser.address = address._id;

  // IF COMPANY, INITIALIZE ADDRESS FOR BILLING ADDRESS
  if (accountType === ACCOUNT_TYPE.COMPANY) {
    const billingAddress = await AddressModel.create({
      addressType: ADDRESS_TYPE.BILLING,
    });
    newUser.billingAddress = billingAddress._id;
  }

  await newUser.save();

  const { token, user } = await generateUserJWT({
    _id: String(newUser._id),
  });

  const otp = generateOTP();

  // STORE CURRENT REQUEST FOR FUTURE REFERENCE
  await VerificationCodeModel.create({
    user: user._id,
    type: VERIFICATION_CODE_TYPE.EMAIL_VERIFICATION,
    code: otp,
  });

  new EmailSender(user.email, 'PulseWorld - Email Verification', 'email_verification', { user: user, otp });

  await setUserLoginActivity(req, newUser);

  return apiResponse({
    res,
    message: 'Successfully Registered',
    data: {
      token,
      user,
    },
  });
};

export const logIn = async (req: Request, res: Response) => {
  const { email, password }: USER_LOGIN_TYPE = req.body;

  // CHECK IF USER EXISTS
  const userExists: User = await getUser(email.toString(), 'Entered Email/Username or Password is incorrect');

  // IF PASSWORDS DOESN'T MATCH
  if (!(await bcrypt.compare(password.toString(), userExists?.password as string))) {
    throw new BadRequestError({ message: 'Incorrect Password' });
  }

  if (userExists.status !== USER_STATUS.ACTIVE)
    throw new BadRequestError({
      message: 'You are currently blocked from accessing the platform',
    });

  // IF USER FOUND
  delete userExists.password;
  const { token, user } = await generateUserJWT({
    _id: String(userExists._id),
  });

  await setUserLoginActivity(req, userExists);

  return apiResponse({
    res,
    message: 'Login Successfull',
    data: {
      token,
      user,
    },
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email }: { email: String } = req.body;

  // CHECK IF USER EXISTS
  const userExists = await getUser(email.toString(), 'Email not registered');

  // USER PASSWORD RESET TOKEN
  const token = await generateResetPasswordToken(email);

  // STORE TOKEN IN DATABASE FOR CHECKING IT's USAGE STATUS IN FUTURE
  await VerificationCodeModel.create({
    user: userExists._id,
    type: VERIFICATION_CODE_TYPE.PASSWORD_RESET,
    code: token,
  });

  // RESET PASSWORD LINK
  const resetLink = process.env.FRONTEND_LINK + `/auth/reset-password?token=${token}`;

  // passwordResetEmail(userExists, resetLink);
  new EmailSender(userExists.email, 'PulseWorld - Reset Password', 'reset_password', {
    username: userExists.username,
    link: resetLink,
  });

  return apiResponse({
    res,
    message: 'Check your email for the password reset link',
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword }: { token: String; newPassword: String } = req.body;

  // VERIFY USER PASSWORD RESET TOKEN
  const decodedToken: any = await verifyResetPasswordToken(token);

  // Find the user with the provided email
  const userExists = await UserModel.findOne({ email: decodedToken?.email });

  // IF USER NOT FOUND
  if (!userExists) {
    throw new BadRequestError({
      message: 'Invalid Email',
    });
  }

  // IF PASSWORDS DOESN'T MATCH
  if (await bcrypt.compare(newPassword.toString(), userExists?.password as string)) {
    throw new BadRequestError({ message: 'New password is same as old password' });
  }

  const verificationCode: any = await VerificationCodeModel.findOne({
    user: userExists._id,
    type: VERIFICATION_CODE_TYPE.PASSWORD_RESET,
    code: token.toString(),
  });

  if (verificationCode.isUsed) {
    throw new BadRequestError({
      message: 'Verification Token Expired',
    });
  }

  verificationCode.isUsed = true;
  await verificationCode.save();

  // HASH THE NEW PASSWORD
  const hashPass = await hashPassword(newPassword.toString());

  userExists.password = hashPass;
  await userExists.save();

  return apiResponse({
    res,
    message: 'Password Reset Successfully',
  });
};

export const sendOtp = async (req: Request, res: Response) => {
  const { email }: { email: String } = req.body;

  // Find the user with the provided email
  const userExists = await UserModel.findOne({ email });

  // IF USER NOT FOUND
  if (!userExists) {
    throw new BadRequestError({
      message: 'Email not registered',
    });
  }

  // GET OTP
  const otp = generateOTP();

  // STORE CURRENT REQUEST FOR FUTURE REFERENCE
  await VerificationCodeModel.create({
    user: userExists._id,
    type: VERIFICATION_CODE_TYPE.EMAIL_VERIFICATION,
    code: otp,
  });

  new EmailSender(userExists.email, 'PulseWorld - Email Verification', 'email_verification', { user: userExists, otp });

  return apiResponse({
    res,
    message: 'Check your email for OTP.',
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, otp }: { email: String; otp: String } = req.body;

  // Find the user with the provided email
  const userExists = await UserModel.findOne({ email }).populate([
    { path: 'address' },
    { path: 'billingAddress' },
    { path: 'profilePicture', select: 'path' },
  ]);

  // IF USER NOT FOUND
  if (!userExists) {
    throw new BadRequestError({
      message: 'Invalid Email',
    });
  }

  const verificationOTP: any = await VerificationCodeModel.findOne({
    user: userExists._id,
    type: VERIFICATION_CODE_TYPE.EMAIL_VERIFICATION,
    code: otp.toString(),
  });

  if (!verificationOTP) {
    throw new BadRequestError({ message: 'Invalid OTP' });
  }

  if (verificationOTP.isUsed) {
    throw new BadRequestError({
      message: 'OTP Expired',
    });
  }

  verificationOTP.isUsed = true;
  await verificationOTP.save();

  // VERIFY THE USER's EMAIL
  userExists.emailVerified = true;
  await userExists.save();

  const user = await fetchUserData(userExists);

  return apiResponse({
    res,
    data: { user },
    message: 'Email Verified Successfully',
  });
};

export const setReferralCode = async (req: Request, res: Response) => {
  const { email, referralCode }: { email: string; referralCode: string } = req.body;

  const userExists: User = await getUser(email, 'Email not registered');

  if (userExists.refParent) {
    throw new BadRequestError({
      message: 'Referral already set',
    });
  }

  const referrer = await UserModel.findOne({ refCode: referralCode });

  if (!referrer) {
    throw new BadRequestError({
      message: 'Invalid Referral Code',
    });
  }

  // UPDATE REFERRAL CODE
  userExists.refParent = referrer._id;
  await userExists.save();

  const user = await fetchUserData(userExists);

  return apiResponse({
    res,
    data: { user },
    message: 'Referral updated successfully',
  });
};

export const checkUsername = async (req: Request, res: Response) => {
  const requestedUsername = req.params.username;

  // IF USERNAME IS LESS THAN 6 CHARACTERS
  // DON'T CHECK IF IT's VALID OR NOT
  if (requestedUsername.length < 6) {
    return apiResponse({
      res,
      success: true,
      data: {
        usernameExists: true,
      },
      message: '',
    });
  }

  // FINDING A USER WITH SAME USERNAME
  const existingUser = await UserModel.countDocuments({ username: requestedUsername });

  // OTHERWISE IT's AVAILABLE
  return apiResponse({
    res,
    success: true,
    data: {
      usernameExists: existingUser > 0,
    },
    message: `Username is ${existingUser > 0 && 'not '}available`,
  });
};

export const checkEmail = async (req: Request, res: Response) => {
  const requestedEmail = req.params.email;

  // FINDING A USER WITH SAME Email
  const existingUser = await UserModel.countDocuments({ email: requestedEmail });

  // OTHERWISE IT's AVAILABLE
  return apiResponse({
    res,
    success: true,
    data: {
      emailExists: existingUser > 0,
    },
    message: `Email is ${existingUser ? 'not' : ''} available`,
  });
};

export const checkReferralCode = async (req: Request, res: Response) => {
  const referralCode = req.params.referralCode;

  // IF REFERRAL CODE IS LESS THAN 6 CHARACTERS
  // DON'T CHECK IF IT's VALID OR NOT
  if (referralCode.length < 6) {
    throw new BadRequestError({
      message: 'Referral code should be atleast 6 chars long.',
    });
  }

  // FINDING A USER WITH THE GIVEN REFERRAL CODE
  const existingUser = await UserModel.findOne({
    refCode: referralCode.toUpperCase(),
  });

  // IF FOUND THROW ERROR, THIS USERNAME IS NOT AVAIABLE
  if (!existingUser) {
    throw new BadRequestError({
      message: 'Invalid Referral Code',
    });
  }

  return apiResponse({
    res,
    success: true,
    message: 'Valid Referral Code',
  });
};

export const setAccountType = async (req: Request, res: Response) => {
  const { email, type }: { email: string; type: string } = req.body;

  const userExists: User = await getUser(email, 'Email not registered');

  if (type !== ACCOUNT_TYPE.COMPANY && type !== ACCOUNT_TYPE.INDIVIDUAL) {
    throw new BadRequestError({
      message: 'Invalid Account Type',
    });
  }

  // INITIALIZING ADDRESS FOR INDIVIDUAL/COMPANY
  const address = await AddressModel.create({
    addressType: type,
  });
  userExists.address = address._id;

  // IF COMPANY, INITIALIZE ADDRESS FOR BILLING ADDRESS
  if (type === ACCOUNT_TYPE.COMPANY) {
    const billingAddress = await AddressModel.create({
      addressType: ADDRESS_TYPE.BILLING,
    });
    userExists.billingAddress = billingAddress._id;
  }

  userExists.accountType = type;
  await userExists.save();

  const user = await fetchUserData(userExists);

  return apiResponse({
    res,
    message: 'Account Type updated successfully',
    data: { user },
  });
};

export const getDefaultRefAccount = async (req: Request, res: Response) => {
  const companyAccount = await UserModel.findOne({
    isCompanyDefaultAccount: true,
  }).select('username email refCode');

  // IF FOUND THROW ERROR, THIS USERNAME IS NOT AVAIABLE
  if (!companyAccount) {
    throw new BadRequestError({
      message: 'Unable to fetch default ref code',
    });
  }

  return apiResponse({
    res,
    success: true,
    data: companyAccount,
    message: 'Ref code fetched successfully',
  });
};

export const getUserBasicDetails = async (req: CustomRequest, res: Response) => {
  const user = await UserModel.findById(req.user?._id).populate([
    { path: 'address' },
    { path: 'billingAddress' },
    { path: 'profilePicture', select: 'path' },
  ]);

  if (!user) {
    throw new BadRequestError({ message: 'Invalid user id' });
  }

  const data = await fetchUserData(user);

  return apiResponse({
    res,
    data,
    message: 'User data fecthed successfully',
  });
};

export const impersonateUser = async (req: Request, res: Response) => {
  const { code } = req.params;

  const authCode = await VerificationCodeModel.findOne({ code, isUsed: false, expireIn: { $gt: new Date() } });
  if (!authCode) throw new BadRequestError({ message: 'Unauthorized', code: 401 });

  const { token, user } = await generateUserJWT({
    _id: String(authCode.user),
  });

  authCode.isUsed = true;
  await authCode.save();

  return apiResponse({
    res,
    message: 'Login Successfull',
    data: {
      token,
      user,
    },
  });
};
