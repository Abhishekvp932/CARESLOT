import { Request,Response } from 'express';

export interface IRatingController {
    addRating(req:Request,res:Response):Promise<void>;
    findDoctorRating(req:Request,res:Response):Promise<void>;
}