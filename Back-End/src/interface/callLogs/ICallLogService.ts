
import { ICallLogDto } from '../../types/ICallLogDTO';

export interface ICallLogService {
    getCallData(appoinmentId:string):Promise<ICallLogDto>
}