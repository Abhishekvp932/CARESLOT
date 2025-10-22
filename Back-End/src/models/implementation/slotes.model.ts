
import { ISlots } from '../interface/ISlots';
import mongoose,{Schema} from 'mongoose';

const slotsSchema = new Schema<ISlots>({
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true
    },
    slotTimes:[
        {
            daysOfWeek:{type:String,required:true},
            startTime:{type:Date,required:true},
            endTime:{type:Date,required:true},
            status:{type:String,enum:['Booked','Available'],default:'Available'},
            slotDuration:{type:Number},
            breakTime:[
                {
                startTime:{type:Date,required:true},
                endTime:{type:Date,required:true}
            },
            ],
        },
    ],
    recurrenceType:{
        type : String,
        enum:['none','daily','weekly','custom'],
        default:'none'
    },
    daysOfWeek:[{type:String}],
    recurrenceStartDate:{type:Date},
    recurrenceEndDate:{type:Date},
},{timestamps:true});

const Slots = mongoose.model<ISlots>('Slot',slotsSchema);

export default Slots;