import { Request, Response,NextFunction } from 'express';
import { IAppoinmentController } from '../../interface/appoinment/IAppoinmentController';
import { IAppoinmentService } from '../../interface/appoinment/IAppoinmentService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';

export class AppoinmentController implements IAppoinmentController {
  constructor(private _appoinmentService: IAppoinmentService) {}


    /**
   * @remarks
   * Handles a POST request to create new appoinment.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */


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

      /**
   * @remarks
   * Handles a PATCH request to cancel an existing appointment.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */


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

      /**
   * @remarks
   * Handles a PATCH request to update an existing appointment.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */

  
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
