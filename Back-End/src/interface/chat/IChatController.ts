
import {Request,Response} from 'express';

export interface IChatController {
  getUserChat(req:Request,res:Response):Promise<void>;
  sendMessage(req:Request,res:Response):Promise<void>;
  getDoctorChat(req:Request,res:Response):Promise<void>;
  getDoctorMessage(req:Request,res:Response):Promise<void>;
  getPatientMessage(req:Request,res:Response):Promise<void>;
  deleteMessage(req:Request,res:Response):Promise<void>;
}