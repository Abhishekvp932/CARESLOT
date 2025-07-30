
import { Request, Response } from "express";
import { ISlotController } from "../../interface/Slots/slotController.interface";
import { ISlotService } from "../../interface/Slots/slotService.interface";
import { emitWarning } from "process";
import { HttpStatus } from "../../utils/httpStatus";
export class SlotController implements ISlotController {
    constructor (private slotService:ISlotService){}

    async addTimeSlot(req: Request, res: Response): Promise<void> {
       try {
       const data = req.body
        console.log(data);
       const result = await this.slotService.addTimeSlot(data);
       res.status(HttpStatus.CREATED).json(result);
       } catch (error) {
        const err = error as Error
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
       }
    }
    async getDoctorSlot(req: Request, res: Response): Promise<void> {
        try {
            console.log('1')
            const {id:doctorId} = req.params

            const result = await this.slotService.getDoctotSlot(doctorId);
            res.status(HttpStatus.OK).json(result);
            console.log('get slot result is',result);
        } catch (error) {
            const err = error as Error
            res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
        }
    }
}