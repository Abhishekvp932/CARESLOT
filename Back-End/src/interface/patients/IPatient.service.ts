import { IDoctor } from "../../models/interface/IDoctor"
import { ISlots } from "../../models/interface/ISlots"
import { DoctorDTO } from "../../types/doctor.dto"
import { doctorDetails } from "../../types/doctorDetails"
import { DoctorListResult } from "../../types/doctorListResult"
import { SpecializationsList } from "../../types/specializationsList"
import { UserDTO } from "../../types/user.dto"

export interface IPatientService {

    getResendAppoinments():Promise<{msg:string,doctors:DoctorDTO[]}>
    updateUserProfile(formData:any,userId:string,profileImg?:string):Promise<{msg:string}>
    getUserData(userId:string):Promise<{msg:string,users:UserDTO}>
    getAllDoctors(page:number,limit:number,search:string,specialty:string):Promise<DoctorListResult>
    getDoctorDetails(doctorId:string):Promise<doctorDetails>
    getDoctorSlots(doctorId:string):Promise<ISlots[]>
    getAllspecializations():Promise<SpecializationsList>
    getDoctorAndSlot(doctorId:string,slotId:string):Promise<{doctor:doctorDetails | null; slot:ISlots | null}>
    getRelatedDoctor(doctorId:string,specialization:string):Promise<doctorDetails[]>
    changePassword(patientId:string,oldPassword:string,newPassword:string):Promise<{msg:string}>
}