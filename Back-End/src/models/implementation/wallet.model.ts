import { IWallet } from '../interface/IWallet';
import mongoose,{Schema} from 'mongoose';

const walletSchema = new Schema<IWallet>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        refPath:'role',
    },
    role:{
        type:String,
        required:true,
        enum:['patient','doctor','admin'],
    },
    balance:{
        type:Number,
        default:0,
    },
},{timestamps:true});

const Wallet = mongoose.model<IWallet>('Wallet',walletSchema);

export default Wallet;