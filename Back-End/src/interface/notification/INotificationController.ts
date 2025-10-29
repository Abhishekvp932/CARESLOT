import {NextFunction, Request,Response} from 'express';
export interface INotificationController {
    getUserNotification(req:Request,res:Response,next:NextFunction):Promise<void>;
    unReadNotification(req:Request,res:Response,next:NextFunction):Promise<void>;
    deleteNotification(req:Request,res:Response,next:NextFunction):Promise<void>;
    deleteAllNotification(req:Request,res:Response,next:NextFunction):Promise<void>;
    readAllNotification(req:Request,res:Response,next:NextFunction):Promise<void>;
}