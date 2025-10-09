import mongoose from 'mongoose';

export interface ICallLogDto {
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