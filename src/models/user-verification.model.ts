// MONGOOSE IMPORTS
import mongoose, { Schema, InferSchemaType } from 'mongoose';
const { ObjectId } = Schema.Types;
import { USER_MODEL_NAME, USER_VERIFICATION_MODEL_NAME } from '../utils/modelName';

// ENUMS
enum VERIFICATION_TYPE {
  KYC = 'KYC',
  KYB = 'KYB',
}

enum VERIFICATION_STATUS {
  VERIFIED = 'VERIFIED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  NOT_VERIFIED = 'NOT_VERIFIED',
}

// SCHEMA
const schema = new Schema(
  {
    user: { type: ObjectId, ref: USER_MODEL_NAME },
    status: {
      type: String,
      enum: VERIFICATION_STATUS,
      default: VERIFICATION_STATUS.NOT_VERIFIED,
    },
    type: { type: String, enum: VERIFICATION_TYPE, default: null },
    companyName: { type: String, default: null },
    email: { type: String, default: null },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    governmentIdNumber: { type: String, default: '' },
    isPoliticalyExposed: { type: Boolean, default: false },
    retryVerification: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: '' },
    rejectedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: USER_VERIFICATION_MODEL_NAME,
    versionKey: false,
  }
);

// INTERFACE & MODEL
interface UserVerification extends InferSchemaType<typeof schema> {
  [x: string]: any;
}
const UserVerificationModel = mongoose.model(
  USER_VERIFICATION_MODEL_NAME,
  schema
);

// EXPORTS
export default UserVerificationModel;
export {
  UserVerification,
  USER_VERIFICATION_MODEL_NAME,
  VERIFICATION_TYPE,
  VERIFICATION_STATUS,
};
