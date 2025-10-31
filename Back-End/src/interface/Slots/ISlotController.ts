import { NextFunction, Request,Response } from 'express';

export interface ISlotController {
    addTimeSlot(req:Request,res:Response,next:NextFunction):Promise<void>
    getDoctorSlot(req:Request,res:Response,next:NextFunction):Promise<void>
    deleteSlot(req:Request,res:Response,next:NextFunction):Promise<void>
}