import mongoose, { Document } from 'mongoose';

export interface ICallLog extends Document{
    doctorId:mongoose.Types.ObjectId,
    patientId:mongoose.Types.ObjectId,
    appoinmentId:mongoose.Types.ObjectId,
    status:'scheduled' | 'ongoing' | 'completed' | 'missed';
    startTime:Date,
    endTime:Date,
    duration:number,
    createdAt:Date,
    updatedAt:Date,
}