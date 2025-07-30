import { Request,Response } from "express"

export interface ISlotController {
    addTimeSlot(req:Request,res:Response):Promise<void>
    getDoctorSlot(req:Request,res:Response):Promise<void>
}