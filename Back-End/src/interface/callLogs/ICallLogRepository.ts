import { ICallLog } from '../../models/interface/ICallLog';
export interface ICallLogRepository {
   create(callData:Partial<ICallLog>):Promise<ICallLog | null>;
   findByAppoinmentId(appoinmentId:string):Promise<ICallLog | null>;
}