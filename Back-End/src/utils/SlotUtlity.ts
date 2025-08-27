

export function genarateSlots(
  startTime: Date,
  endTime: Date,
  slotDuration: number,
  breakTime: { startTime: Date; endTime: Date }[] = []
) {
  const slots: { startTime: Date; endTime: Date; status: 'Available'|'Booked' }[] = [];
  let current = new Date(startTime);

  while (current < endTime) {
    const slotEnd = new Date(current.getTime() + slotDuration * 60000);
    if (slotEnd > endTime) break;

    const isInBreak = breakTime.some(br => current < br.endTime && slotEnd > br.startTime);

    if (!isInBreak) {
      slots.push({ startTime: new Date(current), endTime: new Date(slotEnd), status: 'Available' });
    }
    current = slotEnd;
  }

  return slots;
}