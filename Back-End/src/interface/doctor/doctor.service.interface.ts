import { IDoctor as IDoctorData } from "../../models/interface/IDoctor";
import type { DoctorProfileInput  } from "../../types/doctor";
import type { UploadedFiles } from "../../types/doctor";
export interface QualificationInput{
degree: string;
  institution: string;
  experince: number;
  specialization: string;
  medicalSchool: string;
  graduationYear: number;
  about: string;
  fees: string;
  educationCertificate: string;
  experienceCertificate: string;
  lisence:string; 
}

export interface IDoctor{
    uploadDocument(doctorId:string,input:QualificationInput,profileImage:string):Promise<any>
    getDoctorProfile(doctorId:string):Promise<{msg:string,doctor:IDoctorData}>
    editDoctorProfile(doctorId:string,body:DoctorProfileInput,files:UploadedFiles):Promise<{msg:string}>
}