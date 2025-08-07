
import { ISlots } from "../interface/ISlots";
import mongoose,{Schema} from "mongoose";

const slotsSchema = new Schema<ISlots>({
    startTime:{
        type:Date,
        required:true,
    },
    endTime:{
        type:Date,
        required:true,
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true
    },
    status:{
        type:String,
        enum:["Booked","Available"],
        default:"Available"
    },
    date:{
      type: Date,
      required:true,
    }
},{timestamps:true});

const Slots = mongoose.model<ISlots>("Slot",slotsSchema);

export default Slots