import { UpdateResult } from 'mongoose';
import { INotificationRepository } from '../../interface/notification/INotificationRepository';
import Notification from '../../models/implementation/notification.model';

import { INotification } from '../../models/interface/INotification';
import { BaseRepository } from '../base.repository';

export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
  constructor() {
    super(Notification);
  }

  async findByUserId(userId: string): Promise<INotification[]> {
    return await Notification.find({ userId: userId });
  }


  async findByIdAndUpdate(
    notificationId: string
  ): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }
  async findByIdAndDelete(
    notificationId: string
  ): Promise<INotification | null> {
    return await Notification.findByIdAndDelete(notificationId);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await Notification.deleteMany({ userId });
    return;
  }

  async updateAllNotificationByUserId(userId: string): Promise<UpdateResult> {
    return await Notification.updateMany(
      { userId: userId },
      { $set: { isRead: true } }
    );
  }
}
