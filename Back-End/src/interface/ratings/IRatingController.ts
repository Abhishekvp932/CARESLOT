import { NextFunction, Request,Response } from 'express';

export interface IRatingController {
    addRating(req:Request,res:Response,next:NextFunction):Promise<void>;
    findDoctorRating(req:Request,res:Response,next:NextFunction):Promise<void>;
}