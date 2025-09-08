import { Request, Response } from 'express';
import { IAppoinmentController } from '../../interface/appoinment/IAppoinmentController';
import { IAppoinmentService } from '../../interface/appoinment/IAppoinmentService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';


export class AppoinmentController implements IAppoinmentController {
         constructor (private _appoinmentService : IAppoinmentService){} 

         async createAppoinment(req: Request, res: Response): Promise<void> {
            logger.info('appoinment data is comming .....');
             try {
                const data = req.body;
              const result = await this._appoinmentService.createAppoinment(data);    
              res.status(HttpStatus.CREATED).json(result);             
             } catch (error) {
                const err = error as Error;
                console.error(err.message);
                res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
             }
         }
} 