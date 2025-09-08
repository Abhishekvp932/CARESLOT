import { Request, Response } from 'express';
import { INotificationController } from '../../interface/notification/INotificationController';
import { INotificationService } from '../../interface/notification/INotificationService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';

export class NotificationController implements INotificationController{
  constructor (private _notificationService : INotificationService){}
 async getUserNotification(req: Request, res: Response): Promise<void> {
    try {
         const {patientId} = req.params;
      logger.info('pateint id is coming in notification controller');

     const result = await this._notificationService.getUserNotification(patientId);

     res.status(HttpStatus.OK).json(result);
    } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
    }
 }
 async unReadNotification(req: Request, res: Response): Promise<void> {
     try {
        const {notificationId} = req.params;

        const result = await this._notificationService.unReadNotification(notificationId);
        res.status(HttpStatus.OK).json(result);
     } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});

     }
 }

 async deleteNotification(req: Request, res: Response): Promise<void> {
     try {
        const {notificationId} = req.params;
        const result = await this._notificationService.deleteNotification(notificationId);
        res.status(HttpStatus.OK).json(result);
     } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
     }
 }
 async deleteAllNotification(req: Request, res: Response): Promise<void> {
     try {
        const {patientId} = req.params;
        const result = await this._notificationService.deleteAllNotification(patientId);
        res.status(HttpStatus.OK).json(result);
     } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
     }
 }

}