
import Slots from "../../models/implementation/Slotes.model"
import { ISlots } from "../../models/interface/ISlots";
import { ISlotRepository } from "../../interface/Slots/slotRepository.interface";

export class SlotRepository implements ISlotRepository{
   
 async create(Data: Partial<ISlots>):Promise<ISlots>{
     const newSlot = new Slots(Data);
     await newSlot.save()
     return newSlot;
 } 
 async findByDoctorId(doctorId: string): Promise<ISlots[]> {
     return await Slots.find({doctorId});
 }
}