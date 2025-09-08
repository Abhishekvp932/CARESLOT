import express,{Request,Response} from 'express';
export interface INotificationController {
    getUserNotification(req:Request,res:Response):Promise<void>;
    unReadNotification(req:Request,res:Response):Promise<void>;
    deleteNotification(req:Request,res:Response):Promise<void>;
    deleteAllNotification(req:Request,res:Response):Promise<void>;
}