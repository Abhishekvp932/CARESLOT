import { IWalletHistory } from '../interface/IWallet.history';
import mongoose,{Schema} from 'mongoose';

const walletHistory = new Schema<IWalletHistory>({
    walletId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Wallet',
        required:true,
    },
    appoinmentId:{
        type:mongoose.Types.ObjectId,
        ref:'Appoinment',
    },
    transactionId:{
        type:mongoose.Types.ObjectId,
        ref:'Payment',
    },
    amount:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        enum:['credit','debit']
    },
    source:{
        type:String,
        enum:['refund','consultation','admin_adjustment','cancel appoinment','payout'],
     },
     status:{
        type:String,
        enum:['success','pending','failed']
     },
},{timestamps:true});

const WalletHistory = mongoose.model<IWalletHistory>('WalletHistory',walletHistory);
export default WalletHistory;