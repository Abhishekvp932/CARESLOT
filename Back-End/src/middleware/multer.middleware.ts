import { cloudUpload } from '../config/multer.config';

export const multiFileUpload = cloudUpload.fields([
  { name: 'educationCertificate', maxCount: 1 },
  { name: 'experienceCertificate', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 },
]);