import { PatientRepository } from "../../repositories/auth/auth.repository";
import { AdminRepository } from "../../repositories/admin/admin.repository";
import { IAdminService } from "../../interface/admin/admin.serivce.interface";
import { DoctorRepository } from "../../repositories/doctors/doctor.repository";
import { DoctorAuthRepository } from "../../repositories/doctors/doctor.auth.repository";
import { SERVICE_MESSAGE } from "../../utils/ServiceMessage";
import { hashPassword } from "../../utils/hash";
import { IDoctor as Doctors} from "../../models/interface/IDoctor";
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
async addUser(name: string, email: string, phone: string, gender:string, dob: Date, password: string,profileImage?:string): Promise<{ msg: string; }> {
    const user = await this.patientRepo.findByEmail(email);
    if(user){
      throw new Error(SERVICE_MESSAGE.USER_ALREADY_EXISTS);
    }
    const hashedPassword = await hashPassword(password);
    const newUser = {
      name,
      email,
      phone,
      gender:gender as "male" | "female" | "others",
      DOB:dob,
      profile_img:profileImage,
      password:hashedPassword,
      isVerified:true
    }
   await this.patientRepo.create(newUser);
   
     return {msg:'User add successfully'}
}
async addDoctor(data:unknown): Promise<{ msg: string; }> {
   const doctorData = data as Partial<Doctors>;
     if (!doctorData.email) {
    throw new Error("Email is required");
    }
   const doctor = await this.doctorAuthRepo.findByEmail(doctorData.email);
    if(doctor){
      throw new Error(SERVICE_MESSAGE.USER_ALREADY_EXISTS);
    }
     await this.doctorAuthRepo.create(doctorData);   
  return {msg:'New doctor added successfully'}
}
}
