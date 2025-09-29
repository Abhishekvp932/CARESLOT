import {Request,Response} from 'express';

export interface IWalletController {
  getUserWalletData(req:Request,res:Response):Promise<void>;   
  getDoctorWalletData(req:Request,res:Response):Promise<void>;
}