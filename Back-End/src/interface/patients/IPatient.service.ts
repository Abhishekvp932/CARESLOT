import { IDoctor } from "../../models/interface/IDoctor"
import { ISlots } from "../../models/interface/ISlots"
import { DoctorListResult } from "../../types/doctorListResult"
import { SpecializationsList } from "../../types/specializationsList"
export interface IPatientService {

    getResendAppoinments():Promise<any>
    updateUserProfile(formData:any,userId:string,profileImg?:string):Promise<any>
    getUserData(userId:string):Promise<any>
    getAllDoctors(page:number,limit:number,search:string,specialty:string):Promise<DoctorListResult>
    getDoctorDetails(doctorId:string):Promise<IDoctor>
    getDoctorSlots(doctorId:string):Promise<ISlots[]>
    getAllspecializations():Promise<SpecializationsList>
}