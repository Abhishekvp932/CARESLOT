
export interface QualificationInput{
degree: string;
  institution: string;
  experince: number;
  specialization: string;
  medicalSchool: string;
  graduationYear: number;
  about: string;
  fees: string;
  educationCertificate: string;
  experienceCertificate: string;
  lisence:string; 
}

export interface IDoctor{
    uploadDocument(doctorId:string,input:QualificationInput,profileImage:string):Promise<any>
}