import { Types } from 'mongoose';

export interface IPatientPopulated {
  _id: string | Types.ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  profile_img?: string;
  gender?: string;
  DOB?: Date;
}

export interface ITransactionPopulated {
  _id:string | Types.ObjectId;
  paymentMethod?:string;
}
export interface AppointmentPatientDTO {
  _id: string;
  doctorId: string;
  transactionId: ITransactionPopulated;
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
