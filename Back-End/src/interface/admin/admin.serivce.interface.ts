export interface IAdminService {
    findAllUsers():Promise<any>
    findAllDoctors():Promise<any>
    blockAndUnblockUsers(userId:string,update:boolean):Promise<any>
    blockAndUnblockDoctors(doctorId:string,update:boolean):Promise<any>
    findUnApprovedDoctors():Promise<any>
    doctorApprove(doctorId:string):Promise<any>
    doctorReject(doctorId:string):Promise<any>
}