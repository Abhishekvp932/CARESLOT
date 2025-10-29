import { Request, Response, NextFunction } from 'express';
import { IRatingController } from '../../interface/ratings/IRatingController';
import { IRatingService } from '../../interface/ratings/IRatingService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';

export class RatingController implements IRatingController {
  constructor(private _ratingService: IRatingService) {}
  async addRating(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { doctorId } = req.params;
      const { patientId, rating, review } = req.body;
      logger.debug(req.body);
      const result = await this._ratingService.addRating(
        doctorId,
        patientId,
        rating,
        review
      );

      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error as Error);
    }
  }
  async findDoctorRating(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('doctor rating get request is comming');
      const { doctorId } = req.params;
      const result = await this._ratingService.findDoctorRating(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }
}
