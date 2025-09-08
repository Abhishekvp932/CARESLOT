import { INotification } from '../../models/interface/INotification';
export interface INotificationService {
   getUserNotification(patientId:string):Promise<INotification[]>
   unReadNotification(notificationId:string):Promise<{msg:string}>;
   deleteNotification(notificationId:string):Promise<{msg:string}>;
   deleteAllNotification(userId:string):Promise<{msg:string}>;
}