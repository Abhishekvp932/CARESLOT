import {Profile} from 'passport-google-oauth20';
import { IPatient } from '../../models/interface/IPatient';

export interface IpatientRepository{
   findById(id:string):Promise<IPatient | null>;
   findByEmail(email:string):Promise<IPatient | null>;
   create(patientData:Partial<any>):Promise<IPatient | null>
   updateById(id:string,update:Partial<IPatient>):Promise<IPatient | null>
   upsertWithOTP(email:string,otp:string,otpExpire:Date):Promise<IPatient | null>
   verifyOtp(email:string,otp:string):Promise<boolean>
   findByGoogleId(googleId:string):Promise<IPatient | null>
   createWithGoogle(profile:Profile):Promise<IPatient | null>
   updatePasswordWithEmail(email:string,update:Partial<any>):Promise<IPatient | null>
   findAll():Promise<IPatient []>
   findAllWithPagination(skip:number,limit:number,filter?:Partial<IPatient>):Promise<IPatient[]>
   countAll(filter?:Partial<IPatient>):Promise<number>;

}