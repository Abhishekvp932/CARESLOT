import { DoctorDTO } from './doctor.dto';
export type ChatResponse = {
  specialization: string | null;         
  message: string;    
  doctors?:{profile_img?:string,name?:string,id?:string}[]        
};