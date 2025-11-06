import { ICallLogService } from '../../interface/callLogs/ICallLogService';

import { ICallLogRepository } from '../../interface/callLogs/ICallLogRepository';

import { ICallLogDto } from '../../types/ICallLogDTO';
import logger from '../../utils/logger';

export class CallLogService implements ICallLogService {
  constructor(private _callLogRepository: ICallLogRepository) {}

  async getCallData(appoinmentId: string): Promise<ICallLogDto> {
    logger.info('appoinment id is');
  logger.debug(appoinmentId);
    const callLog = await this._callLogRepository.findByAppoinmentId(appoinmentId);

   if(!callLog){
    throw new Error('Call log not found');
   }

    return callLog;
  }
}
