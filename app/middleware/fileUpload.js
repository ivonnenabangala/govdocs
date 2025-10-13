import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { s3 } from '../configs/awsConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to this file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const uploadFile = (folder) => {
  console.log('Bucket:', process.env.AWS_BUCKET_NAME); // ✅ should now log correctly

  return multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME, // ✅ fixed name (was S3_BUCKET_NAME)
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, `${folder}/${fileName}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = {
        documents: ['application/pdf'],
        images: ['image/jpeg', 'image/png', 'image/jpg'],
      };

      if (
        (folder === 'documents' && allowedMimeTypes.documents.includes(file.mimetype)) ||
        (folder === 'images' && allowedMimeTypes.images.includes(file.mimetype))
      ) {
        cb(null, true);
      } else {
        cb(
          new Error(
            `Invalid file type for ${folder}. Allowed: ${allowedMimeTypes[folder].join(', ')}`
          ),
          false
        );
      }
    },
  });
};
