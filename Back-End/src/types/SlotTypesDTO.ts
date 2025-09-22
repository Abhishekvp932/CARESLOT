export interface IBreak {
  startTime: Date;
  endTime: Date;
}

export interface IDoctorSlotTime {
  daysOfWeek: string; 
  startTime: Date;
  endTime: Date;
  slotDuration: number;
  breakTime?: IBreak[];
}

export interface IDoctorSlotDoc {
  slotTimes: IDoctorSlotTime[];
}

 export interface IBookedSlot {
  date: string; 
  startTime: string;
  endTime:string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled' | string;
}

export interface IGeneratedSlot {
  startTime: string;
  endTime: string;
  status: string;
  dayOfWeek: string;
  doctorId: string;
  date: string;
}


export interface IBreakTime {
  startTime: string;
  endTime: string;  
}

export interface IDaySlot {
  daysOfWeek: string;       
  startTime: string;       
  endTime: string;         
  slotDuration: number;     
  breakTime?: IBreakTime[];
}
