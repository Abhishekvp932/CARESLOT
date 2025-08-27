export function getNextDateOfWeek(dayOfWeek: string, slotStart?: string): Date {
  const daysMap: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
  };

  const today = new Date();
  const todayDay = today.getDay();
  const targetDay = daysMap[dayOfWeek.toLowerCase()];

  let diff = targetDay - todayDay;
  if (diff < 0) diff += 7;

  const candidate = new Date(today);
  candidate.setDate(today.getDate() + diff);


  if (diff === 0 && slotStart) {
    const [h, m] = slotStart.split(':').map(Number);
    const slotStartTime = new Date(today);
    slotStartTime.setHours(h, m, 0, 0);

    if (slotStartTime <= today) {
   
      candidate.setDate(candidate.getDate() + 7);
    }
  }

  return candidate;
}
