import mongoose,{Schema} from "mongoose";
import { IAppoinment } from "../interface/IAppoinments";

const appoinmentSchema = new Schema<(IAppoinment)>({
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true,
    },
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Patient",
        required:true
    },
    slotId:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"Slot",
        required:true
    },
    transactionId:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"Transaction",
        required:true
    }
})