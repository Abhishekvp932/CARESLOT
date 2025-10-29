import Slots from '../../models/implementation/slotes.model';
import { ISlots } from '../../models/interface/ISlots';
import { ISlotRepository } from '../../interface/Slots/ISlotRepository';
import { BaseRepository } from '../base.repository';
export class SlotRepository extends BaseRepository<ISlots> implements ISlotRepository {
   constructor(){
    super(Slots);
   }
  async findByDoctorId(doctorId: string): Promise<ISlots[]> {
    return await Slots.find({ doctorId });
  }
  async findByIdAndDelete(slotId: string): Promise<ISlots | null> {
    return await Slots.findByIdAndDelete(slotId);
  }


  async findByIdAndUpdate(
    doctorId: string,
    data: Partial<ISlots>
  ): Promise<ISlots | null> {
    return await Slots.findOneAndUpdate(
      { doctorId },
      { $set: data },
      { new: true }
    );
  }
}
