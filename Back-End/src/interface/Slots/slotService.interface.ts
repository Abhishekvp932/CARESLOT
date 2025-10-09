
import { ISlotDto } from '../../types/ISlotDTO';
import { RecurrenceSchedule } from '../../utils/AddSlotType';
export interface ISlotService{
    addTimeSlot(data:RecurrenceSchedule):Promise<{msg:string}>
    getDoctotSlot(doctorId:string):Promise<ISlotDto[]>
    deleteSlot(slotId:string):Promise<{msg:string}>
}