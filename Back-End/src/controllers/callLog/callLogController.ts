import { Request, Response, NextFunction } from 'express';
import { ICallLogController } from '../../interface/callLogs/ICallLogController';
import { ICallLogService } from '../../interface/callLogs/ICallLogService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';

export class CallLogController implements ICallLogController {
  constructor(private _callLogService: ICallLogService) {}

    /**
   * @remarks
   * Handles a GET request to get call logs .
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing call logs.
   */

  async getCallData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('call log request is comming .....');
      const { appoinmentId } = req.params;
      const result = await this._callLogService.getCallData(appoinmentId);
      logger.debug(result);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }
}
