import { IDoctor } from '../models/interface/IDoctor';
import { DoctorDTO } from './doctor.dto';
export interface DoctorListResult {
  doctors: DoctorDTO[];
  total: number;
  specializations?:string[];
}