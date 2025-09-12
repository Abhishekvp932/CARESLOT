import mongoose, { Types } from 'mongoose';

export interface IPatientPopulated {
  _id: string | Types.ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  profile_img?: string;
  gender?: string;
  DOB?: Date;
}
export interface AppointmentPatientDTO {
  _id: string;
  doctorId: string;
  transactionId?: string;
  amount?: string;
  status?: string;
  patientId:IPatientPopulated;
  slot: {
    date: string;
    startTime: string;
    endTime: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
