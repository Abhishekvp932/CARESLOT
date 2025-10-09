import { Types } from 'mongoose';

export interface ISlotDto {
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