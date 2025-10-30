import { Request, Response, NextFunction } from 'express';
import { IRatingController } from '../../interface/ratings/IRatingController';
import { IRatingService } from '../../interface/ratings/IRatingService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';

export class RatingController implements IRatingController {
  constructor(private _ratingService: IRatingService) {}

/**
 * @remarks
 * Handles a POST request to add a new rating.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns A success message.
 */
  
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

  /**
   * @remarks
   * Handles a GET request to find a doctor's rating.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing the doctor's rating details.
   */

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
