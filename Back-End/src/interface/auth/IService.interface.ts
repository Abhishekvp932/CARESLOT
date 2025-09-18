
import { Profile } from 'passport-google-oauth20';
import { IBaseUser } from '../../utils/IBaseUser';
import { IPatient } from '../../models/interface/IPatient';
import { LogoutRequest} from '../../types/auth';
import { UserDTO } from '../../types/user.dto';

export interface IService{
     login(email:string,password:string) :Promise<{msg:string,user:IBaseUser,accessToken:string,refreshToken:string}>;
     signup(name:string,email:string,password:string,phone:string,dob:Date,gender:string,role:string):Promise<{msg:string}>;
     verifyOtp(email:string,otp:string):Promise<{msg:string,role:string,user:string}>;
     findOrCreateGoogleUser(profile:Profile):Promise<IPatient>;
     findUserById(id: string):Promise<{users:UserDTO}>
    logOut({sessionId}:LogoutRequest):Promise<{msg:string}>
    resendOTP(email:string):Promise<{msg:string}>;
    verifiyEmail(email:string) : Promise <{msg:string}>;
    verifyEmailOTP(email:string,otp:string):Promise<{msg:string}>;
    forgotPassword(email:string,newPassword:string):Promise<{msg:string}>
    refreshAccessToken(req:any,res:any):Promise<any>;
    getMe({sessionId}:LogoutRequest):Promise<Partial<IPatient>>;
}