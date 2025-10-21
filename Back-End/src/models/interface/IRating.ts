
import mongoose,{ Document } from 'mongoose';
export interface IRating extends Document {
  doctorId:mongoose.Types.ObjectId;
  patientId:mongoose.Types.ObjectId;
  rating:number;
  comment:string;
  createdAt:Date;
  updatedAt:Date;
  
}