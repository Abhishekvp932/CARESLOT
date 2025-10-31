/* eslint-disable semi */
import { NextFunction, Request,Response } from 'express';

export default interface  IDoctorController {
    uploadDocuments(req:Request,res:Response,next:NextFunction):Promise<void>;
    getDoctorProfile(req:Request,res:Response,next:NextFunction):Promise<void>;
    editDoctorProfile(req:Request,res:Response,next:NextFunction):Promise<void>;
    reApplyDoctor(req:Request,res:Response,next:NextFunction):Promise<void>;
    getAllAppoinments(req:Request,res:Response,next:NextFunction):Promise<void>;
    getDoctorDashboardData(req:Request,res:Response,next:NextFunction):Promise<void>;
};