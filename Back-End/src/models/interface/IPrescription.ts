import mongoose, { Document } from 'mongoose';


export interface IPrescription extends Document {
  appoinmentId:mongoose.Types.ObjectId;
  doctorId:mongoose.Types.ObjectId;
  patientId:mongoose.Types.ObjectId;
  diagnosis:string;
  medicines:string;
  advice:string;
  createdAt:Date;
  updatedAt:Date;
}