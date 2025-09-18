
import { UpdateResult } from 'mongoose';
import { INotification } from '../../models/interface/INotification';

export interface INotificationRepository {
   create(notificationData:Partial<INotification>):Promise<INotification | null>;
   findByUserId(userId:string):Promise<INotification[]>;
   findById(notificationId:string):Promise<INotification | null>;
   findByIdAndUpdate(notificationId:string):Promise<INotification | null>;
   findByIdAndDelete(notificationId:string):Promise<INotification | null>;
   deleteAllByUserId(userId:string):Promise<void>;
   updateAllNotificationByUserId(userId:string):Promise<UpdateResult>;
}