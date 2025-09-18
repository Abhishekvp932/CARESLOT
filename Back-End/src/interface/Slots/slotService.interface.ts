
import { ISlots } from '../../models/interface/ISlots';
import { RecurrenceSchedule } from '../../utils/AddSlotType';
export interface ISlotService{
    addTimeSlot(data:RecurrenceSchedule):Promise<{msg:string}>
    getDoctotSlot(doctorId:string):Promise<ISlots[]>
    deleteSlot(slotId:string):Promise<{msg:string}>
}