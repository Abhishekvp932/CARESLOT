import { ICallLog } from '../../models/interface/ICallLog';

export interface ICallLogService {
    getCallData(appoinmentId:string):Promise<ICallLog>
}