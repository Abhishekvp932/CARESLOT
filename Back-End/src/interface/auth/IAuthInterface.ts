import {Profile} from 'passport-google-oauth20';
import { IPatient } from '../../models/interface/IPatient';
import { FilterQuery } from 'mongoose';

export interface IpatientRepository{
   findById(patientId:string):Promise<IPatient | null>;
   findByEmail(email:string):Promise<IPatient | null>;
   create(patientData:Partial<IPatient>):Promise<IPatient | null>
   updateById(patientId:string,update:Partial<IPatient>):Promise<IPatient | null>
   upsertWithOTP(email:string,otp:string,otpExpire:Date):Promise<IPatient | null>
   verifyOtp(email:string,otp:string):Promise<boolean>
   findByGoogleId(googleId:string):Promise<IPatient | null>
   createWithGoogle(profile:Profile):Promise<IPatient | null>
   updatePasswordWithEmail(email:string,update:Partial<IPatient>):Promise<IPatient | null>
   findAll():Promise<IPatient []>
   findAllWithPagination(skip:number,limit:number,filter: FilterQuery<IPatient>):Promise<IPatient[]>
   countAll(filter: FilterQuery<IPatient>):Promise<number>;

}