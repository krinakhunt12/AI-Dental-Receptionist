import { prisma } from '../prisma.js';

export interface AvailableSlot {
  startTime: string; // ISO String
  endTime: string;   // ISO String
  displayTime: string; // e.g. "09:00 AM"
}

export class SlotService {
  static async getAvailableSlots(
    clinicId: string,
    doctorId: string,
    dateStr: string, // "YYYY-MM-DD"
    durationMins = 30
  ): Promise<AvailableSlot[]> {
    const targetDate = new Date(dateStr);
    const dayOfWeek = targetDate.getUTCDay();

    // 1. Get Doctor's Working Hours for this day of week
    const workingHours = await prisma.workingHours.findFirst({
      where: {
        clinicId,
        doctorId,
        dayOfWeek,
        isClosed: false,
      },
    });

    if (!workingHours) {
      return [];
    }

    // Parse start and end working hours (e.g. "09:00", "17:00")
    const [startHour, startMin] = workingHours.startTime.split(':').map(Number);
    const [endHour, endMin] = workingHours.endTime.split(':').map(Number);

    const workStart = new Date(targetDate);
    workStart.setUTCHours(startHour, startMin, 0, 0);

    const workEnd = new Date(targetDate);
    workEnd.setUTCHours(endHour, endMin, 0, 0);

    // 2. Fetch existing active appointments for the doctor on that day
    const dayStart = new Date(targetDate);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        clinicId,
        doctorId,
        deletedAt: null,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        startTime: { gte: dayStart, lte: dayEnd },
      },
    });

    // 3. Generate candidate slot intervals
    const slots: AvailableSlot[] = [];
    let currentSlotStart = new Date(workStart);

    while (currentSlotStart.getTime() + durationMins * 60 * 1000 <= workEnd.getTime()) {
      const currentSlotEnd = new Date(currentSlotStart.getTime() + durationMins * 60 * 1000);

      // Check if candidate slot overlaps with any existing appointment
      const hasOverlap = existingAppointments.some((app) => {
        return (
          currentSlotStart < new Date(app.endTime) &&
          currentSlotEnd > new Date(app.startTime)
        );
      });

      if (!hasOverlap) {
        slots.push({
          startTime: currentSlotStart.toISOString(),
          endTime: currentSlotEnd.toISOString(),
          displayTime: currentSlotStart.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC',
          }),
        });
      }

      // Step by slot duration
      currentSlotStart = new Date(currentSlotStart.getTime() + durationMins * 60 * 1000);
    }

    return slots;
  }
}
