import { IPatientService } from "../../interface/patients/IPatient.service";
import { PatientRepository } from "../../repositories/auth/auth.repository";
import { SERVICE_MESSAGE } from "../../utils/ServiceMessage";
import { DoctorAuthRepository } from "../../repositories/doctors/doctor.auth.repository";
export class PatientService implements IPatientService {
  constructor(private patientRepo: PatientRepository,private doctorRepo:DoctorAuthRepository) {}
  async getResendAppoinments(): Promise<any> {
    
    const doctors = await this.doctorRepo.findAllWithFilter({isApproved:true});

    if(!doctors){
      throw new Error('No doctors found');
    }

    return {msg:"doctors fetched successfully",doctors}
  }
  async updateUserProfile(formData: any, userId: string, profileImg?: string): Promise<any> {
    const user = await this.patientRepo.findById(userId);

    if(!user){
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
    await this.patientRepo.updateById(userId,{...formData,profile_img:profileImg})

    return {msg:"profile updated successfully"}
  }
  async getUserData(userId: string): Promise<any> {
    const users = await this.patientRepo.findById(userId);

    if(!users){
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
    return {msg:"user data fetched successfully",users}
  }
}
