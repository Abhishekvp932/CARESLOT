import { NextFunction, Request, Response } from 'express';


export interface IContactController {
    createContactInformation(req:Request,res:Response,next:NextFunction):Promise<void>;
    getContactsData(req:Request,res:Response,next:NextFunction):Promise<void>;
}