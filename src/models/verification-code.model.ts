// MONGOOSE IMPORTS
import mongoose, { Schema, InferSchemaType } from 'mongoose';
const { ObjectId } = Schema.Types;

// MODEL NAME IMPORTS
import { USER_MODEL_NAME, VERIFICATION_CODE_MODEL_NAME } from '../utils/modelName';

// ENUMS
enum VERIFICATION_CODE_TYPE {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
  PASSWORD_CHANGE_REQUEST = 'PASSWORD_CHANGE_REQUEST',
  IMPERSONATE_USER = 'IMPERSONATE_USER',
}


// SCHEMA
const schema = new Schema(
  {
    user: { type: ObjectId, ref: USER_MODEL_NAME },
    type: {
      type: String,
      enum: VERIFICATION_CODE_TYPE,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    expireIn: { type: Date },
  },
  {
    timestamps: true,
    collection: VERIFICATION_CODE_MODEL_NAME,
    versionKey: false,
  }
);

// INTERFACE & MODEL
interface VerificationCode extends InferSchemaType<typeof schema> {
  [x: string]: any;
}
const VerificationCodeModel = mongoose.model(VERIFICATION_CODE_MODEL_NAME, schema);

// EXPORTS
export default VerificationCodeModel;
export { VerificationCode, VERIFICATION_CODE_MODEL_NAME, VERIFICATION_CODE_TYPE };
