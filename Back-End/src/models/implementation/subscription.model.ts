import mongoose, { Schema } from 'mongoose';
import { ISubscription } from '../interface/ISubscription';

const subscriptionSchema = new Schema <ISubscription>({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    discountAmount:{
        type:Number,
        required:true,
    },
    durationInDays:{
        type:Number,
        default:30,
    },

},{timestamps:true});

const Subscription = mongoose.model<ISubscription>('Subscription',subscriptionSchema);

export default Subscription;