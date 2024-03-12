// MONGOOSE IMPORTS
import mongoose, { Schema, InferSchemaType } from "mongoose";
const { ObjectId } = Schema.Types;

// MODEL NAME IMPORTS
import { ADDRESS_MODEL_NAME } from "./address.model";
import generateReferralCode from "../utils/generateReferralCode";
import { DOCUMENT_MODEL_NAME, USER_MODEL_NAME } from "../utils/modelName";
import { COUNTRY_MODEL_NAME } from "./country.model";

// ENUMS
enum USER_STATUS {
  ACTIVE = "ACTIVE",
  TEMP_BLOCK = "TEMP_BLOCK",
  BLOCK = "BLOCK",
}

enum USER_TYPE {
  USER = "USER",
  ADMIN = "ADMIN",
}

enum ACCOUNT_TYPE {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}

// SCHEMA
const schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    uuid: { type: Number, unique: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    refCode: { type: String, unique: true },
    refParent: { type: ObjectId, ref: USER_MODEL_NAME },
    password: { type: String },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    companyName: { type: String, default: null },
    phoneNumber: { type: String },
    accountType: { type: String, enum: ACCOUNT_TYPE , default : ACCOUNT_TYPE.INDIVIDUAL },
    address: { type: ObjectId, ref: ADDRESS_MODEL_NAME },
    differentBillingAddress: { type: Boolean, default: false },
    billingAddress: { type: ObjectId, ref: ADDRESS_MODEL_NAME },
    country: { type: ObjectId, ref: COUNTRY_MODEL_NAME },
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: ObjectId, ref: DOCUMENT_MODEL_NAME },
    type: { type: String, enum: USER_TYPE, default: USER_TYPE.USER },
    status: { type: String, enum: USER_STATUS, default: USER_STATUS.ACTIVE },
    acceptedAgreement: {
      type: Boolean,
      default: false,
    }, 
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: USER_MODEL_NAME,
    versionKey: false,
  }
);

// PRE-SAVE MIDDLEWARE
schema.pre("save", { document: true }, async function (next) {
  if (!this.uuid) {
    const latest = await UserModel.findOne({}, null, { sort: { uuid: -1 } });
    const uuid = latest?.uuid ? latest.uuid + 1 : 100000000;
    this.uuid = uuid;
  }

  if (!this.refCode) {
    let referralCode;
    let existingUser;

    // Keep generating until a unique referral code is found
    do {
      referralCode = generateReferralCode(6);
      existingUser = await this.model(USER_MODEL_NAME).findOne({
        refCode: referralCode,
      });
    } while (existingUser);

    this.refCode = referralCode;
  }

  next();
});

// INTERFACE & MODEL
interface User extends InferSchemaType<typeof schema> {
  [x: string]: any;
}
const UserModel = mongoose.model(USER_MODEL_NAME, schema);

// EXPORTS
export default UserModel;
export { User, USER_STATUS, USER_TYPE, ACCOUNT_TYPE };
