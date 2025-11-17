import mongoose, { Schema } from 'mongoose';
import { IUserSubscription } from '../interface/IUserSubscription';

const userSubscriptionSchema = new Schema <IUserSubscription>({
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true,
    },
    planId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subscription',
        required:true,
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    isActive:{
        type:Boolean,
        required:true,
    },
},{timestamps:true});

const UserSubscription = mongoose.model<IUserSubscription>('UserSubscription',userSubscriptionSchema);
export default UserSubscription;