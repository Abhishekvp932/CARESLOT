import { ISlots } from "../../models/interface/ISlots";

export interface ISlotRepository{
    create(slotData:Partial<ISlots>):Promise<ISlots | null>
    findByDoctorId(doctorId:string):Promise<ISlots[]>
}