

import {NextFunction, Request,Response} from 'express';
export interface IPaymentController {
    createOrder(req:Request,res:Response,next:NextFunction):Promise<void>;
    verifyOrder(req:Request,res:Response,next:NextFunction):Promise<void>;
    walletPayment(req:Request,res:Response,next:NextFunction):Promise<void>;
    planPayment(req:Request,res:Response,next:NextFunction):Promise<void>;
}