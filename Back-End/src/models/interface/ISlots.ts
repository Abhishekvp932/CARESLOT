import mongoose,{Document, Types} from "mongoose";

export interface ISlots extends Document{
    startTime:Date;
    endTime:Date;
    createdAt?:Date;
    updatedAt?:Date;
    doctorId:Types.ObjectId;
    status:"Booked" | "Available";
    date:Date
   recurrenceType?: "none" | "daily" | "weekly" | "custom";
  daysOfWeek?: number[];
  customDates?: Date[]; 
  recurrenceStartDate?: Date;
  recurrenceEndDate?: Date;
  recurringSlotId?: Types.ObjectId;
}