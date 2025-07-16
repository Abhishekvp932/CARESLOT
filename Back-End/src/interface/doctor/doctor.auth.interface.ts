import {Profile} from 'passport-google-oauth20'
export interface IDoctorAuthRepository{
   findById(id:string):Promise<any>;
   findByEmail(email:string):Promise<any>;
   create(patientData:Partial<any>):Promise<any>
   updateById(id:string,update:Partial<any>):Promise<any>
   upsertWithOTP(email:string,otp:string,otpExpire:Date):Promise<any>
   verifyOtp(email:string,otp:string):Promise<any>
   findByGoogleId(googleId:string):Promise<any>
   createWithGoogle(profile:Profile):Promise<any>
   updatePasswordWithEmail(email:string,update:Partial<any>):Promise<any>
}