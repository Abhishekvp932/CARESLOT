import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from './cloudinary.config';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'doctor_kyc',
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: 'auto',
    };
  },
});

export const cloudUpload = multer({ storage });
