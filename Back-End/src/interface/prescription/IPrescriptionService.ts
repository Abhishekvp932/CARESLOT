import { PrescriptionResult } from '../../types/PrescriptionResult';

export interface IPrescriptionService {
  addPrescription(
    diagnosis: string,
    medicines: string,
    advice: string,
    appoinmentId: string,
    patientId: string,
    doctorId: string
  ): Promise<{msg:string}>;
  downloadPrescription(appoinmentId:string):Promise<Buffer>;
  getAppoinmentPrescription(appoinmentId:string):Promise<PrescriptionResult | null>;
  updatePrescription(appoinmentId:string,diagnosis:string,medicines:string,advice:string):Promise<{msg:string}>;
}
