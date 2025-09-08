import { INotificationRepository } from '../../interface/notification/INotificationRepository';
import Notification from '../../models/implementation/notification.model';

import { INotification } from '../../models/interface/INotification';


export class NotificationRepository implements INotificationRepository{
    constructor (){}

    async create(notificationData: Partial<INotification>): Promise<INotification | null> {
        const notification = new Notification(notificationData);
        await notification.save();
        return notification;
    }

    async findByUserId(userId: string): Promise<INotification[]> {
      return await Notification.find({userId:userId});
    }

    async findById(notificationId: string): Promise<INotification | null> {
        return await Notification.findById(notificationId);
    }
    async findByIdAndUpdate(notificationId: string): Promise<INotification | null> {
        return await Notification.findByIdAndUpdate(notificationId,{isRead:true},{new:true});   
    }
    async findByIdAndDelete(notificationId: string): Promise<INotification | null> {
        return await Notification.findByIdAndDelete(notificationId);
    }

   async deleteAllByUserId(userId: string): Promise<void> {
        await Notification.deleteMany({userId});
        return;
   }
}