import { Document } from 'mongoose';

export interface IDoctor extends Document {
  phone: string;
  password: string;
  email: string;
  isBlocked: boolean;
  profile_img?: string;
  isApproved: boolean;
  isRejected:boolean;
  name: string;
  qualifications?: {
    degree:string;
    institution:string;
    experince:number;
    educationCertificate:string;
    experienceCertificate:string;
    graduationYear:number;
    specialization:string;
    medicalSchool:string;
    about:string;
    fees:string;
    lisence:string

  };
  
  DOB: Date;
  gender: 'male' | 'female' | 'others';
  role: 'doctors';
  createdAt?: Date;
  updatedAt?: Date;
  otp?: string;
  rejectionReason?:string;
  blockReason?:string;
  otpExpire?: Date;
}
