// MODULE IMPORTS
import { body } from 'express-validator';

// VALIDATION SCHEMAS
const signUpValidation = [
  body('username')
    .notEmpty()
    .withMessage('username is required')
    .isLength({ min: 6 })
    .withMessage('username must be minimum length of 6 chars.'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter valid email'),
  body('referralCode').optional().notEmpty().withMessage('Referral Code must not be empty'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password should be minimum length of 8 chars')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  body('confirmPassword')
    .notEmpty()
    .withMessage('confirmPassword is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

const loginValidation = [
  body('email').notEmpty().withMessage('Enter/Username valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password should be minimum length of 8 chars')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
];

const forgotPasswordValidation = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter valid email'),
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New Password is required')
    .isLength({ min: 8 })
    .withMessage('New Password should be minimum length of 8 chars')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage(
      'New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  body('confirmPassword')
    .notEmpty()
    .withMessage('confirmPassword is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

const sendOtpValidation = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter valid email'),
];

const verifyEmailValidation = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter valid email'),
  body('otp').notEmpty().withMessage('OTP is required'),
];

const setReferralCodeValidation = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter valid email'),
  body('referralCode').notEmpty().withMessage('Referral Code is required'),
];

const setAccountTypeValidation = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter valid email'),
  body('type')
    .notEmpty()
    .withMessage('Account Type is required')
    .isIn(['INDIVIDUAL', 'COMPANY'])
    .withMessage('Account Type must be "INDIVIDUAL" or "COMPANY"'),
];

export {
  signUpValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  sendOtpValidation,
  verifyEmailValidation,
  setReferralCodeValidation,
  setAccountTypeValidation,
};
