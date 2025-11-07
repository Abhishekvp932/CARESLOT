import { IDoctorPopulated } from './AppoinmentsAndDoctorDto';
import { IPatientPopulated } from './AppointsAndPatientsDto';
export interface AppoinmentPopulatedDTO{
    _id: string;
    doctorId: IDoctorPopulated;
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

export interface AppoinmentPaginationDTO{
  appoinments:AppoinmentPopulatedDTO[],
  total:number;
}