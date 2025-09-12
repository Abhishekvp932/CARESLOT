import { Types } from 'mongoose';

export interface IDoctorPopulated {
  _id: string | Types.ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  profile_img?: string;
  gender?: string;
  DOB?: Date;
  qualifications:{
    fees?:number;
    specialization:string;
  }
}
export interface AppointmentDoctorDTO {
  _id: string;
  doctorId: IDoctorPopulated;
  transactionId?: string;
  amount?: string;
  status?: string;
  patientId:string;
  slot: {
    date?: string;
    startTime?: string;
    endTime?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
