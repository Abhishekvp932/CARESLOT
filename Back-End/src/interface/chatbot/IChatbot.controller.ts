
import {NextFunction, Request,Response} from 'express';
export interface IChatbotController {
  handleChatMessage(req:Request,res:Response,next:NextFunction):Promise<void>;
}