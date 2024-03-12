// MONGOOSE IMPORTS
import mongoose, { Schema, InferSchemaType } from 'mongoose';
const { ObjectId } = Schema.Types;

// MODEL's NAME IMPORTS
import { DEVICE_HISTORY_MODEL_NAME, USER_MODEL_NAME } from '../utils/modelName';



// SCHEMA
const schema = new Schema(
  {
    user: { type: ObjectId, ref: USER_MODEL_NAME },
    device: { type: String },
    browser: { type: String },
    location: { type: String },
  },
  {
    timestamps: true,
    collection: DEVICE_HISTORY_MODEL_NAME,
    versionKey: false,
  }
);

// INTERFACE & MODEL
interface DeviceHistory extends InferSchemaType<typeof schema> {
  [x: string]: any;
}
const DeviceHistoryModel = mongoose.model(DEVICE_HISTORY_MODEL_NAME, schema);

// EXPORTS
export default DeviceHistoryModel;
export { DeviceHistory, DEVICE_HISTORY_MODEL_NAME };
