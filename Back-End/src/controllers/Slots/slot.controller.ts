import { Request, Response } from 'express';
import { ISlotController } from '../../interface/Slots/slotController.interface';
import { ISlotService } from '../../interface/Slots/slotService.interface';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';
export class SlotController implements ISlotController {
  constructor(private _slotService: ISlotService) {}



  /**
   * @remakrs 
   * This method handles POST Request to add a doctor's available time slot.
   * 
   * @param req 
   * @param res 
   * 
   * @returns A json response with created time slot
   */

  async addTimeSlot(req: Request, res: Response): Promise<void> {
    logger.info('creating new time slot......');
    try {
      const data = req.body;

      const result = await this._slotService.addTimeSlot(data);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }

    
   /**
   * @remakrs 
   * This method handles GET doctor's can see the available slot 
   * 
   * @param req 
   * @param res 
   * 
   * @returns A json response with array of slots time slot
   */


  async getDoctorSlot(req: Request, res: Response): Promise<void> {
    try {
      const { id: doctorId } = req.params;

      const result = await this._slotService.getDoctotSlot(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
   
   /**
   * @remakrs 
   * This method handles DELETE doctor's can delete their slots
   * 
   * @param req 
   * @param res 
   * 
   * @returns return a success message
   */


  async deleteSlot(req: Request, res: Response): Promise<void> {
    try {
      const { id: slotId } = req.params;
      const result = await this._slotService.deleteSlot(slotId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
}
