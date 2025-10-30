import { Request, Response, NextFunction } from 'express';
import { ISlotController } from '../../interface/Slots/ISlotController';
import { ISlotService } from '../../interface/Slots/ISlotService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';
export class SlotController implements ISlotController {
  constructor(private _slotService: ISlotService) {}

  /**
   * @remakrs
   * This method handles POST Request to add a doctor's available time slot.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   *@param next - Express next function.
   * @returns A json response with created time slot
   */

  async addTimeSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    logger.info('creating new time slot......');
    try {
      const data = req.body;
      logger.debug(data);
      const result = await this._slotService.addTimeSlot(data);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remakrs
   * This method handles GET doctor's can see the available slot
   *
   * @param req - Express request object.
   * @param res - Express response object.
   *@param next - Express next function.
   * @returns A json response with array of slots time slot
   */

  async getDoctorSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: doctorId } = req.params;

      const result = await this._slotService.getDoctotSlot(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remakrs
   * This method handles DELETE doctor's can delete their slots
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns return a success message
   */

  async deleteSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { slotId } = req.params;
      const result = await this._slotService.deleteSlot(slotId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }
}
