export interface BreakTime {
  startTime: string;  // e.g. "12:30"
  endTime: string;    // e.g. "13:00"
}

export interface DaySchedule {
  daysOfWeek: 
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
  startTime: string;  // e.g. "09:00"
  endTime: string;    // e.g. "17:00"
  breakTime: BreakTime[];
}

export interface RecurrenceSchedule {
  doctorId: string;
  recurrenceType: 'daily' | 'weekly' | 'monthly'; // you can expand as needed
  recurrenceStartDate: string; // ISO date string
  recurrenceEndDate: string;   // ISO date string
  daysOfWeek: DaySchedule[];
}
