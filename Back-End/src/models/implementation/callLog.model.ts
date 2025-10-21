import { ICallLog } from '../interface/ICallLog';
import mongoose, { Schema } from 'mongoose';

const callLogSchema = new Schema<ICallLog>({
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true,
    },
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true,
    },
    appoinmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Appoinment',
        required:true,
    },
    status:{
        type:String,
        enum:[
          'scheduled',
          'ongoing',
          'completed',
          'missed',
        ],
        default:'scheduled',
    },

    startTime:{
        type:Date,
    },
    endTime:{
        type:Date,
    },
    duration:{
        type:Number

    },
},{timestamps:true});

const CallLog = mongoose.model<ICallLog>('CallLog',callLogSchema);

export default CallLog;

