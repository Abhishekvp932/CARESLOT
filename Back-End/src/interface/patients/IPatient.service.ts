import { IDoctor } from "../../models/interface/IDoctor"
import { ISlots } from "../../models/interface/ISlots"
export interface IPatientService {

    getResendAppoinments():Promise<any>
    updateUserProfile(formData:any,userId:string,profileImg?:string):Promise<any>
    getUserData(userId:string):Promise<any>
    getAllDoctors():Promise<IDoctor[]>
    getDoctorDetails(doctorId:string):Promise<IDoctor>
    getDoctorSlots(doctorId:string):Promise<ISlots[]>
}