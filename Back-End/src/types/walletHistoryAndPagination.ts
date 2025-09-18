import mongoose from 'mongoose';
export interface IwalletHistory{
    walletId:mongoose.Types.ObjectId;
        appoinmentId?:mongoose.Types.ObjectId;
        transactionId?: mongoose.Types.ObjectId;
        amount:number;
        type:string;
        source:string;
        status :string;
        createdAt?:Date;
        updatedAt?:Date;
}

export interface walletHistoryAndPagination {
    walletHistory:IwalletHistory[];
    total:number;
    balance:number;
}
