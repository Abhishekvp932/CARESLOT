import { IDoctor } from "../doctor/doctor.service.interface";

export interface IAdminService {
  findAllUsers(page:number,limit:number): Promise<any>;
  findAllDoctors(page:number,limit:number): Promise<any>;
  blockAndUnblockUsers(userId: string, update: boolean): Promise<any>;
  blockAndUnblockDoctors(doctorId: string, update: boolean): Promise<any>;
  findUnApprovedDoctors(page:number,limit:number): Promise<any>;
  doctorApprove(doctorId: string): Promise<any>;
  doctorReject(doctorId: string): Promise<any>;
  getVerificationDoctorDetails(doctorId: string): Promise<any>;
  updateUserData(
    formData: any,
    userId: string,
    profileImage?: string
  ): Promise<any>;
  editDoctorData(doctorId: string): Promise<any>;
  editDoctorProfile(
    doctorId: string,
    data: Partial<IDoctor>
  ): Promise<{ msg: string }>;

  addUser(
    name: string,
    email: string,
    phone: string,
    gender:string,
    dob: Date,
    password: string,
    profileImage?:string
  ): Promise<{ msg: string }>;

addDoctor(data:unknown):Promise<{msg:string}>

}
