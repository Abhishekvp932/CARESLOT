import { IDoctor } from "../../models/interface/IDoctor"
export interface IPatientService {

    getResendAppoinments():Promise<any>
    updateUserProfile(formData:any,userId:string,profileImg?:string):Promise<any>
    getUserData(userId:string):Promise<any>
    getAllDoctors():Promise<IDoctor[]>
    getDoctorDetails(doctorId:string):Promise<IDoctor>
}