// MONGOOSE IMPORTS
import mongoose, { Schema, InferSchemaType } from 'mongoose';
const { ObjectId } = Schema.Types;

// MODEL's NAME IMPORTS
import { COUNTRY_MODEL_NAME } from './country.model';
import { ADDRESS_MODEL_NAME } from '../utils/modelName';

// ENUMS
export enum ADDRESS_TYPE {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
  BILLING = 'BILLING',
}

// SCHEMA
const schema = new Schema(
  {
    addressType: { type: String, enum: ADDRESS_TYPE },
    country: { type: ObjectId, ref: COUNTRY_MODEL_NAME },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    addressLine: { type: String, default: '' },
    zipCode: { type: String },
  },
  {
    timestamps: true,
    collection: ADDRESS_MODEL_NAME,
    versionKey: false,
  }
);

// INTERFACE & MODEL
interface Address extends InferSchemaType<typeof schema> {
  [x: string]: any;
}
const AddressModel = mongoose.model(ADDRESS_MODEL_NAME, schema);

// EXPORTS
export default AddressModel;
export { Address, ADDRESS_MODEL_NAME };
