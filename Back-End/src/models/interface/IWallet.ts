import mongoose,{Document} from 'mongoose';

export interface IWallet extends Document {
    userId:mongoose.Types.ObjectId;
    role:'patient' | 'doctor' | 'admin';
    balance:number;
    createdAt:Date;
    updatedAt:Date;
}