
import { Request,Response } from "express"
export interface IPatientController {
    getResendAppoinment(req:Request,res:Response):Promise<void>
    updateUserProfile(req:Request,res:Response):Promise<void>
    getUserData(req:Request,res:Response):Promise<void>
    getAllDoctors(req:Request,res:Response):Promise<void>
    getDoctorDetails(req:Request,res:Response):Promise<void>
    getDoctorSlots(req:Request,res:Response):Promise<void>
}