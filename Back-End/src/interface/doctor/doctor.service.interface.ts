
export interface QualificationInput{
degree: string;
  institution: string;
  experience: number;
  specialization: string;
  medicalSchool: string;
  graduationYear: number;
  about: string;
  fees: string;
  educationCertificate: string;
  experienceCertificate: string;
}

export interface IDoctor{
    uploadDocument(doctorId:string,input:QualificationInput):Promise<any>
}