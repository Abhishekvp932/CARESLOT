
export interface IRatingPatient {
    name:string;
}
export interface IRatingDTO {
  doctorId: string;
  patientId: IRatingPatient;
  rating?: number;
  comment?: string;
  createdAt?: Date;
}