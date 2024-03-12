// MONGOOSE IMPORTS
import mongoose, { Schema, InferSchemaType } from 'mongoose';
const { ObjectId } = Schema.Types;

// MODEL NAME IMPORTS
import { RECENT_DEVICES_MODEL_NAME, USER_MODEL_NAME } from '../utils/modelName';

const schema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: USER_MODEL_NAME,
      required: true,
    },
    device: {
      type: String,
    },
    browser: {
      type: String,
    },
    location: {
      type: String,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: RECENT_DEVICES_MODEL_NAME,
    versionKey: false,
  }
);

// INTERFACE & MODEL
interface IRecentDevice extends InferSchemaType<typeof schema> {
  [x: string]: any;
}
const RecentDeviceModel = mongoose.model(RECENT_DEVICES_MODEL_NAME, schema);

// EXPORTS
export default RecentDeviceModel;
export { IRecentDevice, RECENT_DEVICES_MODEL_NAME };
