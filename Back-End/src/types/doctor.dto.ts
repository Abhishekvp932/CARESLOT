
export interface DoctorDTO {
  _id?: string;
  email?: string;
  isBlocked?: boolean;
  isApproved?: boolean;
  name?: string;
  DOB?: Date;
  gender?: 'male' | 'female' | 'others';
  role?: 'doctors';
  updatedAt?: Date;
  createdAt?: Date;
  profile_img?: string;
  qualifications?: {
    degree?: string;
    institution?: string;
    experince?:number;
    educationCertificate?: string;
    experienceCertificate?: string;
    graduationYear?: number;
    specialization?: string;
    medicalSchool?: string;
    about?: string;
    fees?: number;
    lisence?: string;
  };
  totalRating?:number;
  avgRating?:number;
}
