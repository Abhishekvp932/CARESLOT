export interface SlotTypes {
  daysOfWeek: string;
  startTime: string;  
  endTime: string;  
  slotDuration: number;
  breakTime: { startTime: string; endTime: string }[];
}

export interface frontEndSlot{
    doctorId:string;
    recurrenceType:string;
    recurrenceStartDate:string;
    recurrenceEndDate:string;
    daysOfWeek:{daysOfWeeK:string,startTime:string,endTime:string,breakTime:{startTime:string,endTime:string}[]}[]
}


export interface BreakTime {
      breakTime: { startTime: string; endTime: string }[];
}

