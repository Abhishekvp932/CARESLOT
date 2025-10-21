import { Request,Response } from 'express';
import { IRatingController } from '../../interface/ratings/IRatingController';
import { IRatingService } from '../../interface/ratings/IRatingService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';

export class RatingController implements IRatingController {
    constructor(private _ratingService:IRatingService){}
   async addRating(req: Request, res: Response): Promise<void> {
      try {
         const {doctorId} = req.params;
     const {patientId,rating,review} = req.body;
      logger.debug(req.body);
     const result = await this._ratingService.addRating(doctorId,patientId,rating,review);

     res.status(HttpStatus.CREATED).json(result);
      } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
      }
    }
    async findDoctorRating(req: Request, res: Response): Promise<void> {
      try {
        logger.info('doctor rating get request is comming');
        const {doctorId} = req.params;
        const result = await this._ratingService.findDoctorRating(doctorId);
        res.status(HttpStatus.OK).json(result);
      } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
      }
    }
}