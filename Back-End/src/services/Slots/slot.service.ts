import { ISlotService } from '../../interface/Slots/ISlotService';

import { ISlotRepository } from '../../interface/Slots/ISlotRepository';
import { IDoctorAuthRepository } from '../../interface/doctor/IDoctorRepository';
import { SERVICE_MESSAGE } from '../../utils/ServiceMessage';
import logger from '../../utils/logger';
import timeStringToDate from '../../utils/timeStringToDate';

import { RecurrenceSchedule } from '../../utils/AddSlotType';
import { Types } from 'mongoose';
import { ISlotDto } from '../../types/ISlotDTO';
export class SlotService implements ISlotService {
  constructor(
    private _slotRepository: ISlotRepository,
    private _doctorRepository: IDoctorAuthRepository
  ) {}

  async addTimeSlot(data: RecurrenceSchedule): Promise<{ msg: string }> {
    logger.info('time slot data is comming from the back end');
    const doctorId = data?.doctorId;

    logger.debug('doctorid is', doctorId);

    if (!doctorId) {
      throw new Error('No Doctor id provided');
    }

    const slotExists = await this._slotRepository.findByDoctorId(doctorId);
    if (slotExists.length !== 0) {
      const payloadExistingSlot = {
        slotTimes: data?.daysOfWeek?.map((slot) => ({
          daysOfWeek: slot?.daysOfWeek,
          startTime: timeStringToDate(slot?.startTime),
          endTime: timeStringToDate(slot?.endTime),
          slotDuration: 60,
          breakTime: (slot?.breakTime || []).map((b) => ({
            startTime: timeStringToDate(b.startTime),
            endTime: timeStringToDate(b.endTime),
          })),
          status:'Available'
        })),
      };

      await this._slotRepository.findByIdAndUpdate(doctorId, payloadExistingSlot);
      return { msg: 'slot updated successfully' };
    }

    const payload = {
      doctorId: new Types.ObjectId(doctorId),
      recurrenceType: 'weekly',
      recurrenceStartDate: data?.recurrenceStartDate,
      recurrenceEndDate: data?.recurrenceEndDate,
      slotTimes: data?.daysOfWeek?.map((slot) => ({
        daysOfWeek: slot?.daysOfWeek,
        startTime: timeStringToDate(slot?.startTime),
        endTime: timeStringToDate(slot?.endTime),
        slotDuration: 60,
        breakTime: (slot?.breakTime || []).map((b) => ({
          startTime: timeStringToDate(b.startTime),
          endTime: timeStringToDate(b.endTime),
        })),
        status:'Available'
      })),
    };

    await this._slotRepository.create(payload);

    return { msg: 'slot created successfully' };
  }

  async getDoctotSlot(doctorId: string): Promise<ISlotDto[]> {
    const doctor = await this._doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }

    const slots = await this._slotRepository.findByDoctorId(doctorId);

    return slots;
  }
  async deleteSlot(slotId: string): Promise<{ msg: string }> {
    const slot = await this._slotRepository.findById(slotId);
    if (!slot) {
      throw new Error(SERVICE_MESSAGE.SLOT_NOT_FOUND);
    }
    await this._slotRepository.findByIdAndDelete(slotId);
    return { msg: 'Slot deleted successfully' };
  }
}
