import { Request, Response,NextFunction } from 'express';
import { IAppoinmentController } from '../../interface/appoinment/IAppoinmentController';
import { IAppoinmentService } from '../../interface/appoinment/IAppoinmentService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';

export class AppoinmentController implements IAppoinmentController {
  constructor(private _appoinmentService: IAppoinmentService) {}

  async createAppoinment(req: Request, res: Response, next: NextFunction)
: Promise<void> {
    logger.info('appoinment data is comming .....');
    try {
      const data = req.body;
      const result = await this._appoinmentService.createAppoinment(data);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error as Error);

    }
  }
  async cancelAppoinment(req: Request, res: Response, next: NextFunction)
: Promise<void> {
    try {
      logger.info('cancel appoinment request is comming to back end');
      const { appoinmentId } = req.params;
      const result = await this._appoinmentService.cancelAppoinment(
        appoinmentId
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);

    }
  }
  async changeAppoinmentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('appoinment status chagne request is comming');
      const {appoinmentId} = req.params;
      const resutlt = await this._appoinmentService.changeAppoinmentStatus(appoinmentId);
      res.status(HttpStatus.OK).json(resutlt);
      return;
    } catch (error) {
      next(error as Error);
     
    }
  }
}
