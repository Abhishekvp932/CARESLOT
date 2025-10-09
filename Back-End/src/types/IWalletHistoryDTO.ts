import mongoose from 'mongoose';
export interface IWalletHistoryDto {
     walletId:mongoose.Types.ObjectId;
        appoinmentId?:mongoose.Types.ObjectId;
        transactionId?: mongoose.Types.ObjectId;
        amount:number;
        type:'credit' | 'debit';
        source:'refund' | 'consultation' | 'admin_adjustment' | 'cancel appoinment' | 'payout';
        status : 'success' | 'pending' | 'failed';
        createdAt?:Date;
        updatedAt?:Date;
}