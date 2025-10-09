import { ICallLogService } from '../../interface/callLogs/ICallLogService';

import { ICallLogRepository } from '../../interface/callLogs/ICallLogRepository';

import { ICallLogDto } from '../../types/ICallLogDTO';

export class CallLogService implements ICallLogService {
    constructor(private _callLogRepository:ICallLogRepository){}
    
    async getCallData(appoinmentId: string): Promise<ICallLogDto> {
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