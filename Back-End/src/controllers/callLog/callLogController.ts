import { Request, Response } from 'express';
import { ICallLogController } from '../../interface/callLogs/ICallLogController';
import { ICallLogService } from '../../interface/callLogs/ICallLogService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';

export class CallLogController implements ICallLogController {
  constructor(private _callLogService: ICallLogService) {}

  async getCallData(req: Request, res: Response): Promise<void> {
    try {
      logger.info('call log request is comming .....');
      const { appoinmentId } = req.params;
      const result = await this._callLogService.getCallData(appoinmentId);
      logger.debug(result);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
    }
;  }
}
