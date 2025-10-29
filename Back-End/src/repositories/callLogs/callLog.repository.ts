import { ICallLogRepository } from '../../interface/callLogs/ICallLogRepository';
import { ICallLog } from '../../models/interface/ICallLog';
import CallLog from '../../models/implementation/callLog.model';
import { BaseRepository } from '../base.repository';
import { UpdateQuery } from 'mongoose';

export class CallLogRepository
  extends BaseRepository<ICallLog>
  implements ICallLogRepository
{
  constructor() {
    super(CallLog);
  }
  async findByAppoinmentId(appoinmentId: string): Promise<ICallLog | null> {
    return await CallLog.findOne({ appoinmentId: appoinmentId });
  }
async findByAppoinmentIdAndUpdate(appoinmentId: string, update: UpdateQuery<ICallLog>): Promise<ICallLog | null> {
  return await CallLog.findOneAndUpdate({appoinmentId},update,{new:true});
}
}
