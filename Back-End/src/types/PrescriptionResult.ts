export interface PrescriptionResult {
       _id:string;
     appoinmentId?:string;
      doctorId?:string;
      patientId?:string;
      diagnosis:string;
      medicines:string;
      advice:string;
      createdAt?:Date;
      updatedAt?:Date;
}