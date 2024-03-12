// MODULE IMPORTS
import { Response } from 'express';

// UTILS
import { apiResponse } from '../../utils/apiResponse';
import { CustomRequest } from '../../interface/CustomRequest';

// MODELS
import UserVerificationModel, {
  VERIFICATION_STATUS,
  VERIFICATION_TYPE,
} from '../../models/user-verification.model';
import UserModel, { ACCOUNT_TYPE } from '../../models/user.model';
import EmailSender from '../../service/sendEmail.service';
import app from '../../../app';


export const updateVerificationRequest = async (req: CustomRequest, res: Response) => {
  const { status, rejectionReason } = req.body;

  const verificationReq = req.verificationReq;
  const isRejected: boolean = status === VERIFICATION_STATUS.REJECTED;

  // // Update Verification Request
  const updateRequest: any = await UserVerificationModel.findOneAndUpdate(
    { _id: verificationReq._id, status: VERIFICATION_STATUS.PENDING },
    {
      status: status,
      rejectionReason: isRejected ? rejectionReason : null,
      rejectedAt: isRejected ? new Date() : null,
    },
    { new: true }
  );

  if (status === VERIFICATION_STATUS.VERIFIED) {
    await UserModel.findByIdAndUpdate(updateRequest.user?.toString(), {
      isVerified: true,
    });
  }

  new EmailSender(
    req.user?.email,
    `Update on your ${
      req.user?.accountType === ACCOUNT_TYPE.COMPANY ? VERIFICATION_TYPE.KYB : VERIFICATION_TYPE.KYC
    } approval request`,
    'admin/update_on_user_verification_request',
    {
      name:
        req.user?.accountType === ACCOUNT_TYPE.COMPANY
          ? req.user?.companyName
          : req.user?.firstName + ' ' + req.user?.lastName,
      userVerificationType:
        req.user?.accountType === ACCOUNT_TYPE.COMPANY ? VERIFICATION_TYPE.KYB : VERIFICATION_TYPE.KYC,
      status: status,
      isRejected: isRejected,
      rejectionReason: rejectionReason,
    }
  );

  app.socketConnection.triggerUserUpdate(updateRequest.user);

  return apiResponse({
    res,
    message: `User Verification Request (${status}).`,
  });
};

export const getUserVerificationsList = async (req: CustomRequest, res: Response) => {
  const { userId } = req.params;

  const data = await UserVerificationModel.find({ user: userId }, null, { sort: { createdAt: 1 } }).lean();

  return apiResponse({
    res,
    data,
  });
};
