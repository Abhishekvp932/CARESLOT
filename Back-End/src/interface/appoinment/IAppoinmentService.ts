import { appoinemntData } from '../../types/appoinmentData';

export interface IAppoinmentService{
    createAppoinment(data:appoinemntData):Promise<{msg:string}>
}