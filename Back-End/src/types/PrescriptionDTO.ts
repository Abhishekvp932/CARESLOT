export interface PrescriptionPatient {
    name:string
} 
export interface PrescriptionDoctor {
    name:string,
    qualifications:{specialization:string}
}
export interface PrescriptionAppoinment{
  _id:string,
  slot:{date:string,startTime:string}
}

export interface PrescriptionDTO {
    appoinment:PrescriptionAppoinment,
    doctor:PrescriptionDoctor,
    patient:PrescriptionPatient,
    _id:string,
    diagnosis:string,
    medicines:string,
    advice:string,
    createdAt:Date,
}