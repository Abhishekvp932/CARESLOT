
export interface DoctorAppointmentStatusData {
  name: string;
  value: number;
}

export interface DoctorBookingTrendData {
  month: string;
  bookings: number;
  completed: number;
  cancelled: number;
  pendings:number,
}


export interface DoctorDashboardData {
  statusSummary: DoctorAppointmentStatusData[];
  monthlyTrend: DoctorBookingTrendData[];
  activeDoctorsCount:number,
}