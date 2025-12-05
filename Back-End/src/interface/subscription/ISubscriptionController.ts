import { NextFunction, Request, Response } from 'express';

export interface ISubscriptionController {
    createSubscription(req:Request,res:Response,next:NextFunction):Promise<void>;
    getAllSubscription(req:Request,res:Response,next:NextFunction):Promise<void>;
    deleteSubscription(req:Request,res:Response,next:NextFunction):Promise<void>;
    getAllActiveSubscription(req:Request,res:Response,next:NextFunction):Promise<void>;
    editSubscription(req:Request,res:Response,next:NextFunction):Promise<void>;
}