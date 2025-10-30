import { Request, Response, NextFunction } from 'express';
import { INotificationController } from '../../interface/notification/INotificationController';
import { INotificationService } from '../../interface/notification/INotificationService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';

export class NotificationController implements INotificationController {
  constructor(private _notificationService: INotificationService) {}

  /**
   * @remarks
   * Handles a GET request to get user notifications.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message upon successful retrieval of user notifications.
   */

  async getUserNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { patientId } = req.params;
      logger.info('pateint id is coming in notification controller');

      const result = await this._notificationService.getUserNotification(
        patientId
      );

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a POST request to mark a notification as unread.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message upon successful marking of notification as unread.
   */

  async unReadNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { notificationId } = req.params;

      const result = await this._notificationService.unReadNotification(
        notificationId
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a DELETE request to delete a notification.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message upon successful deletion of notification.
   */

  async deleteNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { notificationId } = req.params;
      const result = await this._notificationService.deleteNotification(
        notificationId
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }


  /**
   * @remarks
   * Handles a DELETE request to delete all notifications for a user.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message upon successful deletion of all notifications.
   */

  async deleteAllNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { patientId } = req.params;
      const result = await this._notificationService.deleteAllNotification(
        patientId
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to read all notifications for a user.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message upon successful retrieval of all notifications.
   */

  async readAllNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('read all notification request is comming...');
      const { userId } = req.params;

      const result = await this._notificationService.readAllNotification(
        userId
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }
}
