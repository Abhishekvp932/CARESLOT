
import { ISlots } from "../../models/interface/ISlots"
export interface ISlotService{
    addTimeSlot(data:Partial<ISlots>):Promise<{msg:string}>
    getDoctotSlot(doctorId:string):Promise<ISlots[]>
}