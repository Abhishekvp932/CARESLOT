import mongoose,{Schema} from "mongoose";
import { IPatient } from "../interface/IPatient"

const patientSchema = new Schema<IPatient>({
    email:{
        type:String,
        unique:true,
        required:false
    },
    name:{
        type:String,
        required:false

    },
    phone:{
        type:String,
        required:false
    },
    gender:{
        type:String,
        enum:['male','female','others'],
        required:false,
        default:"male"
    },
    DOB:{
        type:Date,
        required:false
    },
    profile_img:{
        type:String,
    },
    password:{
        type:String,
        required:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:['patients'],
        default:'patients'
    },
    otp:{
        type:String,
        required:false
    },
    otpExpire:{
        type:Date,
        required:false
    },
   isVerified:{
    type:Boolean,default:false
   },
    googleId:{
        type:String,
        required:false,
        unique:true
    }

},{timestamps:true})



const Patient = mongoose.model<IPatient>('Patient',patientSchema);
export default Patient