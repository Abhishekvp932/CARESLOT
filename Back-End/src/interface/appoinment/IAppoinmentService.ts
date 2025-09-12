import { INotification } from '../../models/interface/INotification';
import { appoinemntData } from '../../types/appoinmentData';

export interface IAppoinmentService{
    createAppoinment(data:appoinemntData):Promise<{msg:string,patientNotification:INotification | null,doctorNotification:INotification | null}>
    cancelAppoinment(appoinmentId:string):Promise<{msg:string,doctorNotification:INotification | null}>
}