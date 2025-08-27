
import { ISlots } from '../../models/interface/ISlots';
export interface ISlotService{
    addTimeSlot(data:any):Promise<{msg:string}>
    getDoctotSlot(doctorId:string):Promise<ISlots[]>
    deleteSlot(slotId:string):Promise<{msg:string}>
}