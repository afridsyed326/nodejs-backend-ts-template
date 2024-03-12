// MODULE IMPORTS
import express from 'express';

// MIDDLEWARES
import { validationCheck } from '../../middlewares/validationCheck';

// CONTROLLERS
import {
  logIn,
  signUp,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyEmail,
  setReferralCode,
  checkUsername,
  checkReferralCode,
  setAccountType,
  getDefaultRefAccount,
  checkEmail,
  impersonateUser,
} from '../../controller/auth.controller';

// VALIDATIONS
import {
  loginValidation,
  signUpValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  sendOtpValidation,
  verifyEmailValidation,
  setReferralCodeValidation,
  setAccountTypeValidation,
} from '../../validations/auth.validation';

// ROUTER INITIALIZATION
const router = express.Router();

// ROUTES
router.post('/signup', signUpValidation, validationCheck, signUp);
router.post('/login', loginValidation, validationCheck, logIn);
router.post('/forgot-password', forgotPasswordValidation, validationCheck, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validationCheck, resetPassword);
router.post('/send-otp', sendOtpValidation, validationCheck, sendOtp);
router.post('/verify-email', verifyEmailValidation, validationCheck, verifyEmail);
router.patch('/set-referral-code', setReferralCodeValidation, validationCheck, setReferralCode);
router.patch('/set-account-type', setAccountTypeValidation, validationCheck, setAccountType);
router.get('/check-username/:username', checkUsername);
router.get('/check-email/:email', checkEmail);
router.get('/check-referral-code/:referralCode', checkReferralCode);
router.get('/get-ref', getDefaultRefAccount);
router.get('/impersonate/:code', impersonateUser);

// EXPORTS
export default router;
