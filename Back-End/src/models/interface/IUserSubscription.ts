import mongoose from 'mongoose';

export interface IUserSubscription {
    patientId:mongoose.Types.ObjectId;
    planId:mongoose.Types.ObjectId;
    startDate:Date;
    endDate:Date;
    isActive:boolean;
    createdAt:Date;
    updatedAt:Date;
}