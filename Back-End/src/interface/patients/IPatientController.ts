import { NextFunction, Request,Response } from 'express';
export interface IPatientController {
    getResendAppoinment(req:Request,res:Response,next:NextFunction):Promise<void>
    updateUserProfile(req:Request,res:Response,next:NextFunction):Promise<void>
    getUserData(req:Request,res:Response,next:NextFunction):Promise<void>
    getAllDoctors(req:Request,res:Response,next:NextFunction):Promise<void>
    getDoctorDetails(req:Request,res:Response,next:NextFunction):Promise<void>
    getDoctorSlots(req:Request,res:Response,next:NextFunction):Promise<void>
    getAllspecializations(req:Request,res:Response,next:NextFunction):Promise<void>
    getDoctorAndSlot(req:Request,res:Response,next:NextFunction):Promise<void>
    getRelatedDoctor(req:Request,res:Response,next:NextFunction):Promise<void>
    changePassword(req:Request,res:Response,next:NextFunction):Promise<void>
    getAllAppoinments(req:Request,res:Response,next:NextFunction):Promise<void>;
}