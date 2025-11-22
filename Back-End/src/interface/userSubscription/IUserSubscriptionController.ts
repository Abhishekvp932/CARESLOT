import { NextFunction, Request, Response } from 'express';

export interface IUserSubscriptionController{
    findAllUserSubscription(req:Request,res:Response,next:NextFunction):Promise<void>;
}