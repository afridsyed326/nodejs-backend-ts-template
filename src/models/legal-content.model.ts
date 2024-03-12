// MONGOOSE IMPORTS
import mongoose, { Schema, InferSchemaType } from 'mongoose';
import { LEGAL_CONTENT_MODEL_NAME } from '../utils/modelName';

// ENUMS
enum LEGAL_CONTENT_TYPE {
  PRIVACY_POLICY = 'privacy-policy',
  TERMS_AND_CONDITIONS = 'terms-and-conditions',
  AGREEMENT = 'agreement',
}

// SCHEMA
const schema = new Schema(
  {
    type: {
      type: String,
      enum: LEGAL_CONTENT_TYPE,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: LEGAL_CONTENT_MODEL_NAME,
    versionKey: false,
  }
);

// INTERFACE & MODEL
interface LegalContent extends InferSchemaType<typeof schema> {
  [x: string]: any;
}
const LegalContentModel = mongoose.model(LEGAL_CONTENT_MODEL_NAME, schema);

// EXPORTS
export default LegalContentModel;
export { LegalContent, LEGAL_CONTENT_TYPE };
