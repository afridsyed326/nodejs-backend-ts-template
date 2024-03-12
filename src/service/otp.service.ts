import BadRequestError from '../errors/BadRequestError';
import { User } from '../models/user.model';
import VerificationCodeModel, { VERIFICATION_CODE_TYPE } from '../models/verification-code.model';
import generateOTP from '../utils/generateOTP';
import EmailSender from './sendEmail.service';
import { verfiyUser2Fa } from './user.service';

export enum OTP_EMAIL_STATUS {
  OTP_SENT = 'OTP_SENT',
  OTP_VERIFIED = 'OTP_VERIFIED',
}

export enum OTP_MODE_STATUS {
  EMAIL = 'EMAIL',
  TWO_FA = 'TWO_FA',
  CODE = 'CODE',
}

export const generateOTPandVerify = async (
  user: User,
  verificationCodeType: VERIFICATION_CODE_TYPE,
  otp?: string | undefined,
  emailOptions?: { template: string; subject: string; context: any },
  email?: string | undefined
): Promise<{ status: OTP_EMAIL_STATUS; message: string; mode: OTP_MODE_STATUS }> => {

  if (!otp) {

    const code = generateOTP();
    await VerificationCodeModel.create({
      code,
      user: user._id,
      type: verificationCodeType,
    });

    // Send OTP email
    new EmailSender(email ? email : user.email, emailOptions?.subject, emailOptions?.template, {
      ...emailOptions?.context,
      otp: code,
    });

    return {
      status: OTP_EMAIL_STATUS.OTP_SENT,
      message: 'OTP sent',
      mode: OTP_MODE_STATUS.EMAIL,
    };
  }

  const verificationOTP: any = await VerificationCodeModel.findOne({
    user: user._id,
    type: verificationCodeType,
    code: otp.toString(),
  });

  if (!verificationOTP) {
    throw new BadRequestError({ message: 'Invalid OTP' });
  }

  if (verificationOTP.isUsed) {
    throw new BadRequestError({ message: 'OTP Expired' });
  }

  verificationOTP.isUsed = true;
  await verificationOTP.save();

  return {
    status: OTP_EMAIL_STATUS.OTP_VERIFIED,
    message: 'OTP verified successfully',
    mode: OTP_MODE_STATUS.EMAIL,
  };
};
