import { Types } from 'mongoose';
export interface IAppoinmentDto { 
    doctorId:Types.ObjectId;
       patientId:Types.ObjectId;
       slot:{date:string,startTime:string,endTime:string};
       transactionId?:Types.ObjectId;
       amount:string;
       status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
       createdAt?:Date;
       updatedAt?:Date;
}