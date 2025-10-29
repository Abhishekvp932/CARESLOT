
import { appoinemntData } from '../../types/appoinmentData';
import { INotificationDto } from '../../types/INotificationDTO';

export interface IAppoinmentService{
    createAppoinment(data:appoinemntData):Promise<{msg:string,patientNotification:INotificationDto | null,doctorNotification:INotificationDto | null}>
    cancelAppoinment(appoinmentId:string):Promise<{msg:string,doctorNotification:INotificationDto | null}>
    changeAppoinmentStatus(appoinmentId:string):Promise<{msg:string}>
}