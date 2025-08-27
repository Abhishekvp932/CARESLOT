import {Profile} from 'passport-google-oauth20';
import { IDoctor } from '../../models/interface/IDoctor';
import { DoctorPagination } from '../../types/doctorFiltering';
import { QualificationInput } from './doctor.service.interface';
import { doctorDetails } from '../../types/doctorDetails';
export interface IDoctorAuthRepository{
   findById(id:string):Promise<IDoctor | null>;
   findByEmail(email:string):Promise<IDoctor | null>;
   create(patientData:Partial<any>):Promise<IDoctor | null>
   updateById(id:string,update:Partial<any>):Promise<any>
   upsertWithOTP(email:string,otp:string,otpExpire:Date):Promise<any>
   verifyOtp(email:string,otp:string):Promise<boolean>
   findByGoogleId(googleId:string):Promise<IDoctor | null>
   createWithGoogle(profile:Profile):Promise<IDoctor | null>
   updatePasswordWithEmail(email:string,update:Partial<any>):Promise<IDoctor | null>
   findByIdAndDelete(id:string):Promise<IDoctor | null>
   findAllWithFilter(filter:any):Promise<IDoctor[]>;
   findAll():Promise<IDoctor[]>
    findAllWithPagination(skip:number,limit:number,filter?:Partial<IDoctor>):Promise<IDoctor[]>
    countAll(filter?:Partial<IDoctor>):Promise<number>
    uploadDocument(doctorId: string, data:any): Promise<IDoctor | null>
    findRelatedDoctors(specialization:string,excludeId:string,limit?:number):Promise<IDoctor[]>
    findAppoinmentDoctors(filter:any):Promise<IDoctor[]>;
}