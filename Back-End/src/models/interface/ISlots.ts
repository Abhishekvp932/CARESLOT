import {Document, Types} from 'mongoose';

export interface ISlots extends Document {
  doctorId: Types.ObjectId;

  slotTimes:{
    daysOfWeek:string;
    startTime:Date;
    endTime:Date;
    status:'Available'|'Booked' | string;
    slotDuration:number
    breakTime:{
      startTime:Date;
      endTime:Date;
    }[];}[];

  recurrenceType?: 'none' | 'daily' | 'weekly' | 'custom' | string;
  daysOfWeek?: string[];
  recurrenceStartDate?: Date | string;
  recurrenceEndDate?: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
}
