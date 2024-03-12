import { Storage, Bucket } from '@google-cloud/storage';
import path from 'path';
import moment from 'moment';
import { makeSlug } from './utils';

// Create a Storage instance with the service account key file path
const storage = new Storage({
  keyFilename: path.join(process.cwd(), 'service_account.json'), // Replace with your service account file path
});

export type UploadReturnType = {
  status: boolean;
  name: string | null;
  url: string | null;
  message: string | null;
  fieldname: string;
  size: number | string | null;
  type: string | null;
};

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: any;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export async function uploadFileToGC(reqFile: MulterFile, folder: string = 'uploads'): Promise<UploadReturnType> {
  try {
    const nameWithoutExt = path.parse(reqFile.originalname).name;
    const extension = path.extname(reqFile.originalname);

    let newFilename = `${nameWithoutExt}-plw-${moment().format('DDMMYYHmmss')}-${Math.floor(Math.random() * 100)}`;
    newFilename = makeSlug(newFilename) + extension;

    const bucket: Bucket = storage.bucket(process.env.GC_BUCKET_NAME!);
    const blob = bucket.file(`pulseworld/${folder}/${newFilename}`);

    const uploadPromise = new Promise<UploadReturnType>((resolve, reject) => {
      const blobStream = blob.createWriteStream({ resumable: false });

      blobStream.on('error', (err) => reject({ status: false, name: null, url: null, message: err.message }));

      blobStream.on('finish', async () => {
        try {
          resolve({
            status: true,
            name: blob.name,
            url: blob.publicUrl(),
            message: 'Uploaded successfully',
            fieldname: reqFile.fieldname,
            size: reqFile.size,
            type: extension,
          });
        } catch (err) {
          reject({
            status: false,
            name: blob.name,
            url: blob.publicUrl(),
            message: `Uploaded the file successfully: ${reqFile.originalname}, but public access is denied!`,
            fieldname: reqFile.fieldname,
            size: reqFile.size,
            type: extension,
          });
        }
      });

      blobStream.end(reqFile.buffer);
    });

    return await uploadPromise;
  } catch (error: any) {
    return {
      status: false,
      name: null,
      url: null,
      message: error.message,
      fieldname: reqFile.fieldname,
      size: reqFile.size,
      type: null,
    };
  }
}

export async function uploadFileFromPathToGC(filePath: string, destinationFileName: string) {
  try {
    // Specify the bucket and file path for upload
    const bucket = storage.bucket(process.env.GC_BUCKET_NAME!);
    const file = bucket.file(`pulseworld/${destinationFileName}`);

    console.log({ filePath });

    // Upload the file to the specified location in the bucket
    const fp = path.join(process.cwd(), filePath);
    await file.save(fp);

    console.log(`File ${filePath} uploaded to ${destinationFileName} in ${process.env.GC_BUCKET_NAME!}.`);
    return file;
  } catch (err) {
    console.error('Error uploading file:', err);
  }
}

export async function deleteFileFromGC(fileName: string) {
  try {
    // Specify the bucket and file to be deleted
    const bucket = storage.bucket(process.env.GC_BUCKET_NAME!);
    const file = bucket.file(fileName);

    // Delete the file from the bucket
    await file.delete();

    console.log(`File ${fileName} deleted from ${process.env.GC_BUCKET_NAME!}.`);
  } catch (err) {
    console.error('Error deleting file:', err);
  }
}
