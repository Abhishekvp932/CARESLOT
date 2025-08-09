import { ISlotService } from "../../interface/Slots/slotService.interface";
import { ISlots } from "../../models/interface/ISlots";
import { ISlotRepository } from "../../interface/Slots/slotRepository.interface";
import { IDoctorAuthRepository } from "../../interface/doctor/doctor.auth.interface";
import { SERVICE_MESSAGE } from "../../utils/ServiceMessage";
import logger from "../../utils/logger";
export class SlotService implements ISlotService {
  constructor(
    private _slotRepo: ISlotRepository,
    private doctorRepo: IDoctorAuthRepository
  ) {}

  async addTimeSlot(data: Partial<ISlots>): Promise<{ msg: string }> {

    logger.info('time slot data is comming from the back end');
    const doctorId = data?.doctorId;
    
    if (!doctorId) {
      throw new Error("No Doctor id provided");
    }

    const slots = await this._slotRepo.findByDoctorId(doctorId.toString());

    const duplicate = slots.some(
      (slot) =>
        new Date(slot.date).getTime() === new Date(data.date!).getTime() &&
        new Date(slot.startTime).getTime() ===
          new Date(data.startTime!).getTime() &&
        new Date(slot.endTime).getTime() === new Date(data.endTime!).getTime()
    );

    if (duplicate) {
      throw new Error(SERVICE_MESSAGE.DUPLICATE_SLOT_ERROR);
    }
    await this._slotRepo.create(data);
    return { msg: "slot created successfully" };
  }
  async getDoctotSlot(doctorId: string): Promise<ISlots[]> {
    const doctor = await this.doctorRepo.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }

    const slots = await this._slotRepo.findByDoctorId(doctor?._id);

    return slots;
  }
  async deleteSlot(slotId: string): Promise<{ msg: string }> {
    const slot = await this._slotRepo.findById(slotId);
    if (!slot) {
      throw new Error(SERVICE_MESSAGE.SLOT_NOT_FOUND);
    }
    await this._slotRepo.findByIdAndDelete(slotId);
    return { msg: "Slot deleted successfully" };
  }
}
