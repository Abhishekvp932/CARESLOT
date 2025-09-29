import { ICallLogService } from '../../interface/callLogs/ICallLogService';

import { ICallLogRepository } from '../../interface/callLogs/ICallLogRepository';
import { ICallLog } from '../../models/interface/ICallLog';

export class CallLogService implements ICallLogService {
    constructor(private _callLogRepository:ICallLogRepository){}
    async getCallData(appoinmentId: string): Promise<ICallLog> {
        if(!appoinmentId){
            throw new Error('Appoinment id not found');
        }
        const callLog = await this._callLogRepository.findByAppoinmentId(appoinmentId);
            
        if(!callLog){
            throw new Error('No call data found');
        }
     
        return callLog;
    }
}