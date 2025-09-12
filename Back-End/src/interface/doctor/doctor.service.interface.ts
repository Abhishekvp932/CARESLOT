import { IAppoinment } from '../../models/interface/IAppoinments';
import { IDoctor as IDoctorData } from '../../models/interface/IDoctor';
import { IPatient } from '../../models/interface/IPatient';
import type { DoctorProfileInput  } from '../../types/doctor';
import type { UploadedFiles } from '../../types/doctor';
import { doctorDetails } from '../../types/doctorDetails';
import { DoctorListResult } from '../../types/doctorListResult';
import { AppointmentPatientDTO } from '../../types/AppointsAndPatientsDto';
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
    uploadDocument(doctorId:string,input:QualificationInput,profileImage:string):Promise<{msg:string}>
    getDoctorProfile(doctorId:string):Promise<{msg:string,doctor:doctorDetails}>
    editDoctorProfile(doctorId:string,body:DoctorProfileInput,files:UploadedFiles):Promise<{msg:string}>
    reApplyDoctor(doctorId:string,body:DoctorProfileInput,files:UploadedFiles):Promise<{msg:string}>;
    getAllAppoinments(doctorId:string):Promise<AppointmentPatientDTO[]>
}