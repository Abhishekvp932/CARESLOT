
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
  
  async findAllUsers(page:number,limit:number): Promise<any> {
    const skip = (page-1) * limit
  
    const [userList,total] = await Promise.all([
      this._patientRepo.findAllWithPagination(skip,limit),
      this._patientRepo.countAll(),
     ])
    if (!userList) {
      throw new Error("No user found");
    }
    const users = userList.map((user) => ({
    _id: user?._id,
    email: user?.email,
    name: user?.name,
    phone: user?.phone,
    gender: user?.gender,
    DOB: user?.DOB,
    isBlocked:user?.isBlocked,
    role:user?.role,
    createdAt:user?.createdAt,
    updatedAt:user?.updatedAt,
    profile_img:user?.profile_img
  }));

    return {users,total};
  }


  async findAllDoctors(page:number,limit:number): Promise<any> {
    const skip = (page-1)*limit
 

     const [doctorsList,total] = await Promise.all([
      this._doctorAuthRepo.findAllWithPagination(skip,limit,{isApproved:true}),
      this._doctorAuthRepo.countAll(),
     ])
    if (!doctorsList) {
      throw new Error("No doctors found");
    }
    const doctors = doctorsList.map((doctor)=>({
      _id:doctor?._id,
      email:doctor?.email,
      isBlocked:doctor?.isBlocked,
      isApproved:doctor?.isApproved,
      name:doctor?.name,
      DOB:doctor?.DOB,
      gender:doctor?.gender,
      role:doctor?.role,
      updatedAt:doctor?.updatedAt,
      createdAt:doctor?.createdAt,
      profile_img:doctor?.profile_img,
      qualifications:{
       degree:doctor?.qualifications?.degree,
       institution:doctor?.qualifications?.institution,
       experince:doctor?.qualifications?.experince,
       educationCertificate:doctor?.qualifications?.educationCertificate,
       experienceCertificate:doctor?.qualifications?.experienceCertificate,
       graduationYear:doctor?.qualifications?.graduationYear,
       specialization:doctor?.qualifications?.specialization,
       medicalSchool:doctor?.qualifications?.medicalSchool,
       about:doctor?.qualifications?.about,
       fees:doctor?.qualifications?.fees,
       lisence:doctor?.qualifications?.lisence,
      }
    }))
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

async findUnApprovedDoctors(page:number,limit:number): Promise<any> {
    const skip = (page -1)*limit
     const [doctorsList,total] = await Promise.all([
      this._doctorAuthRepo.findAllWithPagination(skip,limit,{isApproved:false}),
      this._doctorAuthRepo.countAll(),
     ])
    if (!doctorsList) {
      throw new Error("No doctors found");
    }
    const doctors = doctorsList.map((doctor)=>({
      _id:doctor?._id,
      email:doctor?.email,
      isBlocked:doctor?.isBlocked,
      isApproved:doctor?.isApproved,
      name:doctor?.name,
      DOB:doctor?.DOB,
      gender:doctor?.gender,
      role:doctor?.role,
      updatedAt:doctor?.updatedAt,
      createdAt:doctor?.createdAt,
      profile_img:doctor?.profile_img,
      qualifications:{
       degree:doctor?.qualifications?.degree,
       institution:doctor?.qualifications?.institution,
       experince:doctor?.qualifications?.experince,
       educationCertificate:doctor?.qualifications?.educationCertificate,
       experienceCertificate:doctor?.qualifications?.experienceCertificate,
       graduationYear:doctor?.qualifications?.graduationYear,
       specialization:doctor?.qualifications?.specialization,
       medicalSchool:doctor?.qualifications?.medicalSchool,
       about:doctor?.qualifications?.about,
       fees:doctor?.qualifications?.fees,
       lisence:doctor?.qualifications?.lisence,
      }
    }))
     return {doctors,total};
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
