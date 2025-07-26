import { PatientRepository } from "../../repositories/auth/auth.repository";
import { AdminRepository } from "../../repositories/admin/admin.repository";
import { IAdminService } from "../../interface/admin/admin.serivce.interface";
import { DoctorRepository } from "../../repositories/doctors/doctor.repository";
import { DoctorAuthRepository } from "../../repositories/doctors/doctor.auth.repository";
import { SERVICE_MESSAGE } from "../../utils/ServiceMessage";
import { IDoctor } from "../../interface/doctor/doctor.service.interface";
export class AdminService implements IAdminService {
  constructor(
    private patientRepo: PatientRepository,
    private doctorRepo: DoctorRepository,
    private adminRepo: AdminRepository,
    private doctorAuthRepo: DoctorAuthRepository
  ) {}
  async findAllUsers(): Promise<any> {
    const users = await this.patientRepo.findAll();
    if (!users) {
      throw new Error("No user found");
    }
    return { msg: "users fetched successfully", users };
  }
  async findAllDoctors(): Promise<any> {
    const doctors = await this.doctorAuthRepo.findAllWithFilter({isApproved:true});

    if (!doctors) {
      throw new Error("No doctors found");
    }
    return { msg: "doctors fetched successfully", doctors };
  }
  async blockAndUnblockUsers(userId: string, isBlocked: boolean): Promise<any> {
    const user = await this.patientRepo.findById(userId);

    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const updatedUser = await this.patientRepo.updateById(userId, {
      isBlocked,
    });

    if (updatedUser.isBlocked) {
      return { msg: "User blocked successfully" };
    } else {
      return { msg: "user unblocked successfully" };
    }
  }
  async blockAndUnblockDoctors(
  doctorId: string,
  isBlocked: boolean
): Promise<any> {
  const doctor = await this.doctorAuthRepo.findById(doctorId);
  if (!doctor) {
    throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
  }

  await this.doctorAuthRepo.updateById(doctorId, { isBlocked });

  return {
    msg: isBlocked ? "Doctor blocked successfully" : "Doctor unblocked successfully",
  };
}

async findUnApprovedDoctors(): Promise<any> {
     const doctors = await this.doctorAuthRepo.findAllWithFilter({isApproved:false})

     if(!doctors){
      throw new Error ("No doctor for verification");
     }

     return {msg:"verification list fetched successfully",doctors};
}
 async doctorApprove(doctorId:string): Promise<any> {
  console.log('1')
     const doctors = await this.doctorAuthRepo.findById(doctorId);
       console.log('approving doctor',doctors);
     if(!doctors){
      throw new Error("No dotors found");
     }
     await this.doctorAuthRepo.updateById(doctorId,{isApproved:true});

     return {msg:"Doctors Approved successfully",doctors}
 }

 async doctorReject(doctorId: string): Promise<any> {
      const doctor = await this.doctorAuthRepo.findById(doctorId)

      if(!doctor){
        throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND)
      }
      await this.doctorAuthRepo.findByIdAndDelete(doctorId)

      return {msg:"Doctor reject successfully"}
 }
 async getVerificationDoctorDetails(doctorId: string): Promise<any> {
      
  const doctor = await this.doctorAuthRepo.findById(doctorId);
    
  if(!doctor){
    throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
  }
   
  return {msg:"doctor fethced successfull",doctor}
 }

 async updateUserData(formData: any, userId: string,profileImage?:string): Promise<any> {
   const user = await this.patientRepo.findById(userId)
   console.log('admin updating user is',user);
   if(!user){
    throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
   }
   await this.patientRepo.updateById(userId,{...formData,profile_img:profileImage});

   return {msg:"user profile updated successfully"};

 }

 async editDoctorData(doctorId: string): Promise<any> {
    const doctor = await this.doctorAuthRepo.findById(doctorId);
       if(!doctor){
        throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
       }
       return {msg:"edit doctor data taken success fully",doctor};
   }
   async editDoctorProfile(doctorId: string, data: Partial<IDoctor>): Promise<{msg:string}> {
     const doctor = await this.doctorAuthRepo.findById(doctorId)
     if(!doctor){
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
     }

     await this.doctorAuthRepo.updateById(doctorId,data);
     
     return {msg:"doctor profile updated successfully"}
  
   }
}
