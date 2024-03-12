import mongoose, { Schema, InferSchemaType } from 'mongoose';
import { DOCUMENT_MODEL_NAME } from '../utils/modelName';
const { ObjectId } = Schema.Types;

const PRODUCT_MODEL_NAME = 'product';

enum PRODUCT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

const schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: ObjectId, ref: DOCUMENT_MODEL_NAME },
    images: [{ type: ObjectId, ref: DOCUMENT_MODEL_NAME }],
    purchaseCount: { type: String }, // fake purchase count to show to user
    status: {
      type: String,
      enum: PRODUCT_STATUS,
      default: PRODUCT_STATUS.INACTIVE,
    },
    // refReward: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: PRODUCT_MODEL_NAME,
    versionKey: false,
  }
);

interface Product extends InferSchemaType<typeof schema> {
  [x: string]: any;
}

const ProductModel = mongoose.model(PRODUCT_MODEL_NAME, schema);
export default ProductModel;
export { Product, PRODUCT_STATUS, PRODUCT_MODEL_NAME };
