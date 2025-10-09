import { INotificationDto } from '../../types/INotificationDTO';
export interface INotificationService {
   getUserNotification(patientId:string):Promise<INotificationDto[]>
   unReadNotification(notificationId:string):Promise<{msg:string}>;
   deleteNotification(notificationId:string):Promise<{msg:string}>;
   deleteAllNotification(userId:string):Promise<{msg:string}>;
   readAllNotification(userId:string):Promise<{msg:string}>;
}