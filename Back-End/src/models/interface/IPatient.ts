    import mongoose,{Document} from "mongoose";

    export interface IPatient extends Document {
       
        email:string;
        name:string;
        phone?:string;
        gender:'male' | 'female' | 'others';
        DOB:Date;
        profile_img?:string;
        password:string;
        isBlocked:boolean;
        googleId?:string;
        role:'patients';
        otp?:string;
        otpExpire?:Date;
        isVerified?:boolean;
        createdAt?:Date;
        updatedAt?:Date;   

    } 