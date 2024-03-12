import { ObjectId } from 'mongoose';
import UserVerificationModel, { VERIFICATION_STATUS } from '../models/user-verification.model';
import { ACCOUNT_TYPE, User } from '../models/user.model';

export const getCurrentUserVerification = async (userId: ObjectId) => {
  const userVerification = await UserVerificationModel.findOne(
    {
      user: userId,
      retryVerification: false,
    },
    null,
    { sort: { createdAt: -1 } }
  );

  return userVerification;
};

export const getKycIncompleteMessage = async (user: User): Promise<string> => {
  const kycStatus = await getCurrentUserVerification(user._id);

  let message = `Please complete your ${user.accountType === ACCOUNT_TYPE.INDIVIDUAL ? 'KYC' : 'KYB'}`;

  if (!kycStatus) message = `Please complete your ${user.accountType === ACCOUNT_TYPE.INDIVIDUAL ? 'KYC' : 'KYB'}`;
  else if (kycStatus.status === VERIFICATION_STATUS.PENDING)
    message = `Your ${user.accountType === ACCOUNT_TYPE.INDIVIDUAL ? 'KYC' : 'KYB'} is under review, please try again later`;
  else if (kycStatus.status === VERIFICATION_STATUS.REJECTED)
    message = `Your ${user.accountType === ACCOUNT_TYPE.INDIVIDUAL ? 'KYC' : 'KYB'} has been rejected due to '${kycStatus.rejectionReason}'`;

  return message;
};
