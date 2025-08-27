import { ISlotService } from '../../interface/Slots/slotService.interface';
import { ISlots } from '../../models/interface/ISlots';
import { ISlotRepository } from '../../interface/Slots/slotRepository.interface';
import { IDoctorAuthRepository } from '../../interface/doctor/doctor.auth.interface';
import { SERVICE_MESSAGE } from '../../utils/ServiceMessage';
import logger from '../../utils/logger';
import { genarateSlots } from '../../utils/SlotUtlity';
import timeStringToDate from '../../utils/timeStringToDate';
import { SlotTypes } from '../../types/slotTypes';
export class SlotService implements ISlotService {
  constructor(
    private _slotRepo: ISlotRepository,
    private _doctorRepo: IDoctorAuthRepository
  ) {}

    async addTimeSlot(data: any): Promise<{ msg: string }> {

      logger.info('time slot data is comming from the back end');
      const doctorId = data?.doctorId;
     
      logger.debug('doctorid is',doctorId);

      if (!doctorId) {
        throw new Error('No Doctor id provided');
      }

      const slotExists = await this._slotRepo.findByDoctorId(doctorId);
      if(slotExists.length !== 0){
        const payloadExistingSlot = {
        slotTimes:data?.daysOfWeek?.map((slot:SlotTypes)=>({
          daysOfWeek:slot?.daysOfWeek,
          startTime:timeStringToDate(slot?.startTime),
          endTime:timeStringToDate(slot?.endTime),
          slotDuration:60,
          breakTime:(slot?.breakTime || []).map((b)=>({
            startTime:timeStringToDate(b.startTime),
            endTime:timeStringToDate(b.endTime),
          }))
        }))
        
      };

      
      
       await this._slotRepo.findByIdAndUpdate(doctorId,payloadExistingSlot);
       return { msg: 'slot updated successfully' };
      }
        
      const payload = {
        doctorId : doctorId,
        recurrenceType:data?.recurrenceType,
        recurrenceStartDate:data?.recurrenceStartDate,
        recurrenceEndDate:data?.recurrenceEndDate,
        slotTimes:data?.daysOfWeek?.map((slot:SlotTypes)=>({

          daysOfWeek:slot?.daysOfWeek,
          startTime:timeStringToDate(slot?.startTime),
          endTime:timeStringToDate(slot?.endTime),
          slotDuration:60,
          breakTime:(slot?.breakTime || []).map((b)=>({
            startTime:timeStringToDate(b.startTime),
            endTime:timeStringToDate(b.endTime),
          }))

        }))
        
      };

     

      await this._slotRepo.create(payload);

      return {msg:'slot created successfully'};
    }


  async getDoctotSlot(doctorId: string): Promise<ISlots[]> {
    const doctor = await this._doctorRepo.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }

    const slots = await this._slotRepo.findByDoctorId(doctorId);

    return slots;
  }
  async deleteSlot(slotId: string): Promise<{ msg: string }> {
    const slot = await this._slotRepo.findById(slotId);
    if (!slot) {
      throw new Error(SERVICE_MESSAGE.SLOT_NOT_FOUND);
    }
    await this._slotRepo.findByIdAndDelete(slotId);
    return { msg: 'Slot deleted successfully' };
  }
}
