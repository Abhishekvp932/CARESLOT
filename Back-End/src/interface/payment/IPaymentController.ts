

import express,{Request,Response} from 'express';
export interface IPaymentController {
    createOrder(req:Request,res:Response):Promise<void>;
    verifyOrder(req:Request,res:Response):Promise<void>;
}