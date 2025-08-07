
import { Profile } from "passport-google-oauth20";
import { IBaseUser } from "../../utils/IBaseUser";
export interface IService{
     login(email:string,password:string) :Promise<{msg:string,user:IBaseUser,accessToken:string,refreshToken:string}>;
     signup(name:string,email:string,password:string,phone:string,dob:Date,gender:string,role:string):Promise<any>;
     verifyOtp(email:string,otp:string):Promise<any>;
     findOrCreateGoogleUser(profile:Profile):Promise<any>;
     findUserById(id: string):Promise<any>
    logOut():Promise<string>
    resendOTP(email:string):Promise<any>;
    verifiyEmail(email:string) : Promise <any>;
    verifyEmailOTP(email:string,otp:string):Promise<any>;
    forgotPassword(email:string,newPassword:string):Promise<any>
    refreshAccessToken(req:any,res:any):Promise<any>
}