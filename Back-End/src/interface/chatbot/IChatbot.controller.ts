
import express,{Request,Response} from 'express';
export interface IChatbotController {
  handleChatMessage(req:Request,res:Response):Promise<void>;
}