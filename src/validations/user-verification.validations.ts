import { body, param } from "express-validator";
import UserVerificationModel, {
  UserVerification,
  VERIFICATION_STATUS,
} from "../models/user-verification.model";
import mongoose from "mongoose";

export const updateUserVerificationValidation = [
  body("status")
    .notEmpty()
    .withMessage("status is required.")
    .isIn([
      VERIFICATION_STATUS.PENDING,
      VERIFICATION_STATUS.REJECTED,
      VERIFICATION_STATUS.VERIFIED,
    ])
    .withMessage(
      `Status can be from ${VERIFICATION_STATUS.PENDING}, ${VERIFICATION_STATUS.REJECTED}, ${VERIFICATION_STATUS.VERIFIED}`
    ),
  param("id").notEmpty().withMessage("Verification Request ID is required."),
];

export const checkUpdateVerificationRequest = [
  body("status")
    .notEmpty()
    .withMessage("status is required.")
    .isIn([
      VERIFICATION_STATUS.PENDING,
      VERIFICATION_STATUS.REJECTED,
      VERIFICATION_STATUS.VERIFIED,
    ])
    .withMessage(`Invalid Status Code`),
  param("id")
    .notEmpty()
    .withMessage("varification id is required")
    .custom(async (value: string, { req }) => {
      if (req.body.status === VERIFICATION_STATUS.REJECTED) {
        if (!req.body.rejectionReason)
          throw new Error("Rejection reason is required.");
      }
      // check given id is ObjectId || for checking
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid id format");
      }
      const verificationReq: UserVerification | null =
        await UserVerificationModel.findById(value);

      if (verificationReq?.status === VERIFICATION_STATUS.VERIFIED)
        throw new Error("Request Already Verified");
      if (verificationReq?.status === VERIFICATION_STATUS.REJECTED)
        throw new Error("Request Already Rejected");

      if (!verificationReq) {
        throw new Error("Invalid Varification Request Id");
      }
      req.verificationReq = verificationReq;
      return true;
    }),
];
