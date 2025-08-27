import mongoose,{Document, Types} from 'mongoose';

export interface ISlots extends Document {
  doctorId: Types.ObjectId;

  slotTimes:{
    daysOfWeek:string;
    startTime:Date;
    endTime:Date;
    status:'Available'|'Booked';
    slotDuration:number
    breakTime:{
      startTime:Date;
      endTime:Date;
    }[];}[];

  recurrenceType?: 'none' | 'daily' | 'weekly' | 'custom';
  daysOfWeek?: string[];
  recurrenceStartDate?: Date;
  recurrenceEndDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
