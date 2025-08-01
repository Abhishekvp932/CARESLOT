import { ISlotService } from "../../interface/Slots/slotService.interface";
import { ISlots } from "../../models/interface/ISlots";
import { ISlotRepository } from "../../interface/Slots/slotRepository.interface";
import { IDoctorAuthRepository } from "../../interface/doctor/doctor.auth.interface";
import { SERVICE_MESSAGE } from "../../utils/ServiceMessage";
export class SlotService implements ISlotService {
  constructor(
    private _slotRepo: ISlotRepository,
    private doctorRepo: IDoctorAuthRepository
  ) {}

  async addTimeSlot(data: Partial<ISlots>): Promise<{ msg: string }> {
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
}
