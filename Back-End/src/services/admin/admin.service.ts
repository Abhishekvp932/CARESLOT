
import { IAdminService } from "../../interface/admin/admin.serivce.interface";

import { SERVICE_MESSAGE } from "../../utils/ServiceMessage";
import { hashPassword } from "../../utils/hash";
import { IDoctor as Doctors} from "../../models/interface/IDoctor";

import { IDoctor } from "../../interface/doctor/doctor.service.interface";
import { IpatientRepository } from "../../interface/auth/auth.interface";
import { IDoctorRepository } from "../../interface/doctor/doctor.repo.interface";
import { IAdminRepository } from "../../interface/admin/admin.repo.interface";
import { IDoctorAuthRepository } from "../../interface/doctor/doctor.auth.interface";

export class AdminService implements IAdminService {
  constructor(
    private _patientRepo: IpatientRepository,
    private _doctorRepo: IDoctorRepository,
    private _adminRepo: IAdminRepository,
    private _doctorAuthRepo: IDoctorAuthRepository
  ) {}
  
  async findAllUsers(): Promise<any> {
    const users = await this._patientRepo.findAll();
    if (!users) {
      throw new Error("No user found");
    }
    return { msg: "users fetched successfully", users };
  }


  async findAllDoctors(page:number,limit:number): Promise<any> {
    const skip = (page-1)*limit
 

     const [doctors,total] = await Promise.all([
      this._doctorAuthRepo.findAllWithPagination({isApproved:true},skip,limit),
      this._doctorAuthRepo.countAll(),
     ])
    if (!doctors) {
      throw new Error("No doctors found");
    }
     return {doctors,total};
  }


  async blockAndUnblockUsers(userId: string, isBlocked: boolean): Promise<any> {
    const user = await this._patientRepo.findById(userId);

    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const updatedUser = await this._patientRepo.updateById(userId, {
      isBlocked,
    });

    if (updatedUser?.isBlocked) {
      return { msg: "User blocked successfully" };
    } else {
      return { msg: "user unblocked successfully" };
    }
  }
  async blockAndUnblockDoctors(
  doctorId: string,
  isBlocked: boolean
): Promise<any> {
  const doctor = await this._doctorAuthRepo.findById(doctorId);
  if (!doctor) {
    throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
  }

  await this._doctorAuthRepo.updateById(doctorId, { isBlocked });

  return {
    msg: isBlocked ? "Doctor blocked successfully" : "Doctor unblocked successfully",
  };
}

async findUnApprovedDoctors(): Promise<any> {
     const doctors = await this._doctorAuthRepo.findAllWithFilter({isApproved:false})

     if(!doctors){
      throw new Error ("No doctor for verification");
     }

     return {msg:"verification list fetched successfully",doctors};
}
 async doctorApprove(doctorId:string): Promise<any> {
      const doctors = await this._doctorAuthRepo.findById(doctorId); 
     if(!doctors){
      throw new Error("No dotors found");
     }
     await this._doctorAuthRepo.updateById(doctorId,{isApproved:true});

     return {msg:"Doctors Approved successfully",doctors}
 }

 async doctorReject(doctorId: string): Promise<any> {
      const doctor = await this._doctorAuthRepo.findById(doctorId)

      if(!doctor){
        throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND)
      }
      await this._doctorAuthRepo.findByIdAndDelete(doctorId)

      return {msg:"Doctor reject successfully"}
 }
 async getVerificationDoctorDetails(doctorId: string): Promise<any> {
      
  const doctor = await this._doctorAuthRepo.findById(doctorId);
    
  if(!doctor){
    throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
  }
   
  return {msg:"doctor fethced successfull",doctor}
 }

 async updateUserData(formData: any, userId: string,profileImage?:string): Promise<any> {
   const user = await this._patientRepo.findById(userId)
    
   if(!user){
    throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
   }
   await this._patientRepo.updateById(userId,{...formData,profile_img:profileImage});

   return {msg:"user profile updated successfully"};

 }

 async editDoctorData(doctorId: string): Promise<any> {
    const doctor = await this._doctorAuthRepo.findById(doctorId);
       if(!doctor){
        throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
       }
       return {msg:"edit doctor data taken success fully",doctor};
   }
   async editDoctorProfile(doctorId: string, data: Partial<IDoctor>): Promise<{msg:string}> {
     const doctor = await this._doctorAuthRepo.findById(doctorId)
     if(!doctor){
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
     }

     await this._doctorAuthRepo.updateById(doctorId,data);
     
     return {msg:"doctor profile updated successfully"}
  
   }
async addUser(name: string, email: string, phone: string, gender:string, dob: Date, password: string,profileImage?:string): Promise<{ msg: string; }> {
    const user = await this._patientRepo.findByEmail(email);
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
   await this._patientRepo.create(newUser);
   
     return {msg:'User add successfully'}
}
async addDoctor(data:unknown): Promise<{ msg: string; }> {
   const doctorData = data as Partial<Doctors>;
     if (!doctorData.email) {
    throw new Error("Email is required");
    }
   const doctor = await this._doctorAuthRepo.findByEmail(doctorData.email);
    if(doctor){
      throw new Error(SERVICE_MESSAGE.USER_ALREADY_EXISTS);
    }
     await this._doctorAuthRepo.create(doctorData);   
  return {msg:'New doctor added successfully'}
}
}
