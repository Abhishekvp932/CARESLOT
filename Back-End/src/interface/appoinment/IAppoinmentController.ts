import {Request,Response,NextFunction} from 'express';

export interface IAppoinmentController {
    createAppoinment(req:Request,res:Response,next:NextFunction):Promise<void>;
    cancelAppoinment(req:Request,res:Response,next:NextFunction):Promise<void>;
    changeAppoinmentStatus(req:Request,res:Response,next:NextFunction):Promise<void>;
}