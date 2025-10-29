
import type { DoctorProfileInput  } from '../../types/doctor';
import type { UploadedFiles } from '../../types/doctor';
import { doctorDetails } from '../../types/doctorDetails';

import { AppointmentPatientDTO } from '../../types/AppointsAndPatientsDto';
import { DoctorDashboardData } from '../../types/IDoctorDashboardDto';
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

export interface IDoctorService{
    uploadDocument(doctorId:string,input:QualificationInput,profileImage:string):Promise<{msg:string}>
    getDoctorProfile(doctorId:string):Promise<{msg:string,doctor:doctorDetails}>
    editDoctorProfile(doctorId:string,body:DoctorProfileInput,files:UploadedFiles):Promise<{msg:string}>
    reApplyDoctor(doctorId:string,body:DoctorProfileInput,files:UploadedFiles):Promise<{msg:string}>;
    getAllAppoinments(doctorId:string,page:number,limit:number,status:string):Promise<{appoinments:AppointmentPatientDTO[],total:number}>
    getDoctorDashboardData(doctorId:string,filter:string):Promise<DoctorDashboardData>;
}