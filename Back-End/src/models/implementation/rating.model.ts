import mongoose from 'mongoose';
import { IRating } from '../interface/IRating';
import { Schema } from 'mongoose';
const ratingSchema = new Schema<IRating>({
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true
    },
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
    comment:{
        type:String,
        required:true
    }
},{timestamps:true});

const Rating = mongoose.model<IRating>('Rating',ratingSchema);

export default Rating;