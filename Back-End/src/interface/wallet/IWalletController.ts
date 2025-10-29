import {NextFunction, Request,Response} from 'express';

export interface IWalletController {
  getUserWalletData(req:Request,res:Response,next:NextFunction):Promise<void>;   
  getDoctorWalletData(req:Request,res:Response,next:NextFunction):Promise<void>;
}