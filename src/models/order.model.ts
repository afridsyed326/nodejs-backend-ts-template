import mongoose, { Schema, InferSchemaType } from 'mongoose';
import { PRODUCT_MODEL_NAME } from './product.model';
import { PAYMENT_METHOD_MODEL_NAME } from './payment_method.model';
import { ORDER_MODEL_NAME, USER_MODEL_NAME } from '../utils/modelName';
const { ObjectId } = Schema.Types;

enum ORDER_PAYMENT_STATUS {
  NOT_PAID = 'NOT_PAID',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

enum ORDER_STATUS {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

enum ORDER_INTENT {
  PRODUCT_BUY = 'PRODUCT_BUY',
  WALLET_DEPOSIT = 'WALLET_DEPOSIT',
}

enum ORDER_CURRENCY {
  EUR = 'EUR',
  USD = 'USD',
}

const schema = new Schema(
  {
    user: { type: ObjectId, ref: USER_MODEL_NAME, required: true },
    intent: { type: String, enum: ORDER_INTENT, required: true },
    product: { type: ObjectId, ref: PRODUCT_MODEL_NAME },
    paymentMethod: {
      type: ObjectId,
      ref: PAYMENT_METHOD_MODEL_NAME,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ORDER_PAYMENT_STATUS,
      default: ORDER_PAYMENT_STATUS.NOT_PAID,
    },
    status: { type: String, enum: ORDER_STATUS, default: ORDER_STATUS.PENDING },
    transactionFee: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    note: { type: String, default: '' },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, enum: ORDER_CURRENCY, required: true },
    // refReward: { type: Number, default: 0 },
    externalPaymentId: { type: String, deafult: '' },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: ORDER_MODEL_NAME,
    versionKey: false,
  }
);

interface Order extends InferSchemaType<typeof schema> {
  [x: string]: any;
}

const OrderModel = mongoose.model(ORDER_MODEL_NAME, schema);
export default OrderModel;
export { Order, ORDER_MODEL_NAME, ORDER_CURRENCY, ORDER_INTENT, ORDER_STATUS, ORDER_PAYMENT_STATUS };
