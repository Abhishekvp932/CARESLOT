
type Gender = 'male' | 'female' | 'others';
export type DoctorProfileInput = {
  name?: string;
  email?: string;
  phone?: string;
  DOB?: string;
  gender?: Gender;
  degree?: string;
  institution?: string;
  specialization?: string;
  medicalSchool?: string;
  experince?: string;
  graduationYear?: string;
  fees?: string;
  license?: string;
  about?: string;
  educationCertificate?:string,
  experienceCertificate?:string,
  profile_image:string
};



export type UploadedFiles = {
  profileImage?: Express.Multer.File[];
  educationCertificate?: Express.Multer.File[];
  experienceCertificate?: Express.Multer.File[];
};
