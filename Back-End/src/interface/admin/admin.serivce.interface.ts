import { IDoctor } from "../doctor/doctor.service.interface"

export interface IAdminService {
    findAllUsers():Promise<any>
    findAllDoctors():Promise<any>
    blockAndUnblockUsers(userId:string,update:boolean):Promise<any>
    blockAndUnblockDoctors(doctorId:string,update:boolean):Promise<any>
    findUnApprovedDoctors():Promise<any>
    doctorApprove(doctorId:string):Promise<any>
    doctorReject(doctorId:string):Promise<any>
    getVerificationDoctorDetails(doctorId:string):Promise<any>
    updateUserData(formData:any,userId:string,profileImage?:string):Promise<any>
    editDoctorData(doctorId:string):Promise<any>;
    editDoctorProfile(doctorId:string,data:Partial<IDoctor>):Promise<{msg:string}>
}