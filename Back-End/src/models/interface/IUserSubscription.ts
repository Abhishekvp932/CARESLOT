import mongoose from 'mongoose';

export interface IUserSubscription {
    _id:string | mongoose.Types.ObjectId;
    patientId:mongoose.Types.ObjectId;
    planId:mongoose.Types.ObjectId;
    transactionId:mongoose.Types.ObjectId;
    startDate:Date;
    endDate:Date;
    isActive:boolean;
    createdAt:Date;
    updatedAt:Date;
}