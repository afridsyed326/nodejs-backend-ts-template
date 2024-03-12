// MONGOOSE IMPORTS
import mongoose, { InferSchemaType, ObjectId, Schema } from 'mongoose';
import { DOCUMENT_MODEL_NAME } from '../utils/modelName';
const { ObjectId } = Schema.Types;

// ENUMS
export enum DOCUMENT_FILE_TYPE {
  png = 'png',
  jpg = 'jpg',
  jpge = 'jpge',
  jpeg = 'jpeg',
  svg = 'svg',
  gif = 'gif',
  pdf = 'pdf',
  doc = 'doc',
  docx = 'docx',
  xls = 'xls',
  xlsx = 'xlsx',
  ppt = 'ppt',
  pptx = 'pptx',
  txt = 'txt',
  csv = 'csv',
  mp4 = 'mp4',
  mp3 = 'mp3',
  wav = 'wav',
  mov = 'mov',
  avi = 'avi',
  zip = 'zip',
  rar = 'rar',
  tar = 'tar',
  other = 'other',
}

export enum DOCUMENT_TYPE {
  GOVERMENT_ID = 'GOVERMENT_ID',
  LOGO = 'LOGO',
  PRODUCT_IMAGE = 'PRODUCT_IMAGE',
  PROFILE_PICTURE = 'PROFILE_PICTURE',
  OTHER = 'OTHER',
}

// SCHEMA
const schema: Schema = new Schema(
  {
    user: { type: ObjectId },
    name: { type: String },
    path: { type: String, required: true },
    size: { type: Number },
    fileType: { type: String, enum: DOCUMENT_FILE_TYPE, required: true },
    documentType: {
      type: String,
      enum: DOCUMENT_TYPE,
      default: DOCUMENT_TYPE.OTHER,
    },
    isSaved: { type: Boolean, default: null },
  },
  {
    timestamps: true,
    collection: DOCUMENT_MODEL_NAME,
    versionKey: false,
  }
);

// INTERFACE & MODEL
export interface Document extends InferSchemaType<typeof schema> {
  [x: string]: any;
}
const DocumentModel = mongoose.model(DOCUMENT_MODEL_NAME, schema);

// EXPORTS
export default DocumentModel;
