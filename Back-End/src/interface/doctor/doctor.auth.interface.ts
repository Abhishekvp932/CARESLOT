import {Profile} from 'passport-google-oauth20';
import { IDoctor } from '../../models/interface/IDoctor';

import { FilterQuery, UpdateQuery } from 'mongoose';
export interface IDoctorAuthRepository{
   findById(id:string):Promise<IDoctor | null>;
   findByEmail(email:string):Promise<IDoctor | null>;
   create(patientData:Partial<IDoctor>):Promise<IDoctor | null>
   updateById(id:string,update:UpdateQuery<IDoctor>):Promise<IDoctor | null>
   upsertWithOTP(email:string,otp:string,otpExpire:Date):Promise<IDoctor | null>
   verifyOtp(email:string,otp:string):Promise<boolean>
   findByGoogleId(googleId:string):Promise<IDoctor | null>
   createWithGoogle(profile:Profile):Promise<IDoctor | null>
   updatePasswordWithEmail(email:string,update:Partial<IDoctor | null>):Promise<IDoctor | null>
   findByIdAndDelete(id:string):Promise<IDoctor | null>
   findAllWithFilter(filter:FilterQuery<IDoctor>):Promise<IDoctor[]>;
   findAll():Promise<IDoctor[]>
    findAllWithPagination(skip:number,limit:number, filter: FilterQuery<IDoctor>):Promise<IDoctor[]>
    countAll(filter: FilterQuery<IDoctor>):Promise<number>
    uploadDocument(doctorId: string, data:Partial<IDoctor>): Promise<IDoctor | null>
    findRelatedDoctors(specialization:string,excludeId:string,limit?:number):Promise<IDoctor[]>
    findAppoinmentDoctors(filter:FilterQuery<IDoctor>):Promise<IDoctor[]>;

}