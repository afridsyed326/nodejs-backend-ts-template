// THIRD PARTY IMPORTS
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
// UTILS
import BadRequestError from '../errors/BadRequestError';

// MODELS IMPORTS
import UserModel from '../models/user.model';


// UTILITY FUNCTIONS
export const checkDuplicateUser = async (email: String, username: String) => {
  const user = await UserModel.findOne({
    $or: [{ email }, { username }],
    deletedAt: null,
  });

  if (user) {
    if (user.email === email) {
      throw new BadRequestError({
        code: 409,
        message: 'Email already registered',
      });
    } else if (user.username === username) {
      throw new BadRequestError({
        code: 409,
        message: 'Username already in use',
      });
    }
  }
};

export const checkUserExists = async (query: Object) => {
  const user = await UserModel.findOne({
    ...query,
    deletedAt: null,
  });

  if (user) {
    return user;
  }

  return null;
};

export const getUser = async (email: string, errorMessage: string, type?: string) => {
  // CHECK IF USER EXISTS
  let q: any;
  q = {
    $or: [{ email: email }, { username: email }],
  };
  q = type ? { ...q, type } : q;

  const userExists = await checkUserExists(q);

  // IF USER NOT FOUND
  if (!userExists) {
    throw new BadRequestError({
      message: errorMessage,
    });
  }

  return userExists;
};

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    // Handle error
    console.error('Error hashing password:', error);
    throw new Error('Error hashing password');
  }
}

export const generateUserPasswordHash = async (password: string) => {
  const hashedPassword = await hashPassword(password);
  return hashedPassword;
};

export const verfiyUser2Fa = (user: any, code: string) => {
  const secret = JSON.parse(user.tfaSecret).base32;

  const verify = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: code,
  });

  if (!verify) {
    throw new BadRequestError({ message: 'Invalid OTP.' });
  }

  return true;
};