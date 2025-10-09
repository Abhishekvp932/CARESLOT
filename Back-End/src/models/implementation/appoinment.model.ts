import mongoose,{Schema} from 'mongoose';
import { IAppoinment } from '../interface/IAppoinments';


const appoinmentSchema = new Schema<(IAppoinment)>({
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true,
    },
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true
    },
    slot:{
        date:String,
        startTime:String,
        endTime:String
    },
    transactionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Transaction',
        required:false
    },
    amount:{
      type:String,
    },
    status:{
         type:String,
         enum:['pending' , 'confirmed' , 'completed' , 'cancelled' , 'rescheduled'],
        default:'pending',
    }
},{timestamps:true});


appoinmentSchema.index(
  { doctorId: 1, 'slot.date': 1, 'slot.startTime': 1 },
  { unique: true }
);

const Appoinment = mongoose.model<IAppoinment>('Appoinment',appoinmentSchema);
export default Appoinment;