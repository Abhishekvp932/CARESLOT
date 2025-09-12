import { INotificationService } from '../../interface/notification/INotificationService';
import { INotificationRepository } from '../../interface/notification/INotificationRepository';
import { INotification } from '../../models/interface/INotification';

export class NotificationService implements INotificationService {
  constructor(private _notificationRepository: INotificationRepository) {}
  async getUserNotification(patientId: string): Promise<INotification[]> {
    const notifications = await this._notificationRepository.findByUserId(
      patientId
    );

    console.log('notifcations', notifications);

    return notifications;
  }
  async unReadNotification(notificationId: string): Promise<{ msg: string }> {
    console.log('notification id is comming', notificationId);
    if (!notificationId) {
      throw new Error('notification id not found');
    }
    const notification = await this._notificationRepository.findById(
      notificationId
    );

    if (!notification) {
      throw new Error('Notification not found');
    }
    await this._notificationRepository.findByIdAndUpdate(notificationId);

    return { msg: 'notification updated' };
  }

  async deleteNotification(notificationId: string): Promise<{ msg: string }> {
    if (!notificationId) {
      throw new Error('Notification id not found');
    }
    const notification = await this._notificationRepository.findById(
      notificationId
    );

    if (!notification) {
      throw new Error('Notification not found');
    }

    await this._notificationRepository.findByIdAndDelete(notificationId);

    return { msg: 'notification deleted' };
  }
  async deleteAllNotification(userId: string): Promise<{ msg: string }> {
    if (!userId) {
      throw new Error('User not found');
    }

    await this._notificationRepository.deleteAllByUserId(userId);

    return { msg: 'all notification deleted' };
  }
}
