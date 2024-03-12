import mongoose, { Schema, InferSchemaType } from 'mongoose';
import { PAYMENT_METHOD_MODEL_NAME } from '../utils/modelName';
const { ObjectId } = Schema.Types;


enum PAYMENT_METHOD_TYPES {
  CARD = 'CARD',
}

enum PAYMENT_METHOD_STATUS_TYPES {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

enum FEE_TYPE {
  AMMOUNT = 'AMMOUNT',
  PERCENTAGE = 'PERCENTAGE',
}

const schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: PAYMENT_METHOD_TYPES, required: true },
    status: {
      type: String,
      enum: PAYMENT_METHOD_STATUS_TYPES,
      default: PAYMENT_METHOD_STATUS_TYPES.ACTIVE,
    },
    fee: { type: Number, default: 0 },
    feeType: { type: String, enum: FEE_TYPE },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: PAYMENT_METHOD_MODEL_NAME,
    versionKey: false,
  }
);

interface PaymentMethod extends InferSchemaType<typeof schema> {
  [x: string]: any;
}

const PaymentMethodModel = mongoose.model(PAYMENT_METHOD_MODEL_NAME, schema);
export default PaymentMethodModel;
export { PaymentMethod, PAYMENT_METHOD_MODEL_NAME, PAYMENT_METHOD_TYPES, PAYMENT_METHOD_STATUS_TYPES };
