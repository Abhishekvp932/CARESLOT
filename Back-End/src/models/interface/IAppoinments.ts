 import mongoose,{Document, Types} from "mongoose";

export interface IAppoinment extends Document{
   doctorId:Types.ObjectId;
   patientId:Types.ObjectId;
   slotId:Types.ObjectId;
   transactionId:Types.ObjectId;
   status : "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";
   createdAt?:Date;
   updatedAt?:Date;
}