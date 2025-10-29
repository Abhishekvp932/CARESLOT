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
}
