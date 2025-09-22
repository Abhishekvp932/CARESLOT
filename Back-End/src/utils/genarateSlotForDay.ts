import { IBreakTime, IDaySlot } from '../types/SlotTypes';
import { getNextDateOfWeek } from './getDayOfWeek';
import { genarateSlots } from './SlotUtlity';

export function generateSlotsForDay(slot: IDaySlot) {
  const dayDate = getNextDateOfWeek(slot.daysOfWeek, slot.startTime);

  const [startH, startM] = slot.startTime.split(':').map(Number);
  let [endH, endM] = slot.endTime.split(':').map(Number);

  
  const startTime = new Date(dayDate);
  startTime.setHours(startH, startM, 0, 0);

  const endTime = new Date(dayDate);
  endTime.setHours(endH, endM, 0, 0);
  

  const breaks = (slot.breakTime || []).map((b:IBreakTime) => {
    const brStart = new Date(dayDate);
    const [brStartH, brStartM] = b.startTime.split(':').map(Number);
    brStart.setHours(brStartH, brStartM, 0, 0);

    const brEnd = new Date(dayDate);
    const [brEndH, brEndM] = b.endTime.split(':').map(Number);
    brEnd.setHours(brEndH, brEndM, 0, 0);

    return { startTime: brStart, endTime: brEnd };
  });

  return genarateSlots(startTime, endTime, slot.slotDuration, breaks);
}
