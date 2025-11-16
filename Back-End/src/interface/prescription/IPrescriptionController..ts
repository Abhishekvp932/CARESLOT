import { NextFunction, Request, Response } from 'express';

export interface IPrescriptionController{
    addPrescription(req:Request,res:Response,next:NextFunction):Promise<void>;
    downloadPrescription(req:Request,res:Response,next:NextFunction):Promise<void>;
    getAppoinmentPrescription(req:Request,res:Response,next:NextFunction):Promise<void>;
    updatePrescription(req:Request,res:Response,next:NextFunction):Promise<void>;
}