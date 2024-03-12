// MONGOOSE IMPORTS
import mongoose, { InferSchemaType, Schema } from 'mongoose';
import { COUNTRY_MODEL_NAME } from '../utils/modelName';

// ENUMS
enum COUNTRY_STATUS {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}


// SCHEMA
const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    phoneCode: String,
    flag: String,
    status: {
      type: String,
      enum: COUNTRY_STATUS,
      default: COUNTRY_STATUS.ENABLED,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: COUNTRY_MODEL_NAME,
  }
);

// TYPE & MODEL
type Country = InferSchemaType<typeof schema>;
const CountryModel = mongoose.model(COUNTRY_MODEL_NAME, schema);

// EXPORTS
export default CountryModel;
export { Country, COUNTRY_STATUS, COUNTRY_MODEL_NAME };
