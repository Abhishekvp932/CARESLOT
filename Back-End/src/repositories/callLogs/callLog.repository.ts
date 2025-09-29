import { ICallLogRepository } from '../../interface/callLogs/ICallLogRepository';
import { ICallLog } from '../../models/interface/ICallLog';
import CallLog from '../../models/implementation/ICallLog.model';
import { BaseRepository } from '../base.repository';

export class CallLogRepository extends BaseRepository <ICallLog> implements ICallLogRepository {
    constructor(){
        super(CallLog);
    }
    async findByAppoinmentId(appoinmentId: string): Promise<ICallLog | null> {
        return await CallLog.findOne({appoinmentId:appoinmentId});
    }
}