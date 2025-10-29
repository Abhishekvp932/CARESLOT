import { DoctorDTO } from './doctor.dto';

export interface AppointmentStatusData {
  name: string;
  value: number;
}

export interface BookingTrendData {
  month: string;
  bookings: number;
  completed: number;
  cancelled: number;
}


export interface DashboardData {
  statusSummary: AppointmentStatusData[];
  monthlyTrend: BookingTrendData[];
  activeDoctorsCount:number,
  topDoctors:DoctorDTO[],
}