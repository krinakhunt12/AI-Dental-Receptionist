/**
 * Quiet hours calculation utility.
 * Standard rules:
 * - Quiet hours: 21:00 to 08:00 in clinic local time.
 * - If sendAt falls in quiet hours, shift to 08:00 local time.
 *   - If sendAt hour >= 21:00 local, shift to 08:00 local next morning.
 *   - If sendAt hour < 08:00 local, shift to 08:00 local that morning.
 * - EXCEPTIONS: instructions where isCritical === true OR category === 'FASTING',
 *   which must keep their exact computed time.
 * - Default timezone: 'Asia/Kolkata'
 * - Return value: UTC Date
 */

export interface QuietHoursOptions {
  utcDate: Date;
  timezone?: string;
  isCritical?: boolean;
  category?: string;
}

export function adjustForQuietHours({
  utcDate,
  timezone = 'Asia/Kolkata',
  isCritical = false,
  category = '',
}: QuietHoursOptions): Date {
  // Critical and Fasting instructions must keep their exact scheduled time
  if (isCritical || category.toUpperCase() === 'FASTING') {
    return new Date(utcDate.getTime());
  }

  const tz = timezone && timezone.trim() !== '' ? timezone.trim() : 'Asia/Kolkata';

  // Extract date parts in the clinic local timezone
  let formatter: Intl.DateTimeFormat;
  try {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });
  } catch {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });
  }

  const parts = formatter.formatToParts(utcDate);
  const partMap: Record<string, number> = {};
  for (const p of parts) {
    if (p.type !== 'literal') {
      partMap[p.type] = parseInt(p.value, 10);
    }
  }

  const localHour = partMap.hour ?? 0;
  const localMinute = partMap.minute ?? 0;

  // Check if in quiet hours: 21:00 <= time < 08:00
  // Note: 21:00:00 to 07:59:59 is inside quiet hours
  const isQuiet = localHour >= 21 || localHour < 8;

  if (!isQuiet) {
    return new Date(utcDate.getTime());
  }

  // Target local date:
  // If localHour >= 21, move to 08:00:00 next day
  // If localHour < 8, move to 08:00:00 same day
  const targetYear = partMap.year;
  const targetMonth = partMap.month;
  let targetDay = partMap.day;

  if (localHour >= 21) {
    targetDay += 1;
  }

  // Convert (targetYear, targetMonth, targetDay, 8, 0, 0) in tz to UTC Date
  return localTimeToUtc(targetYear, targetMonth, targetDay, 8, 0, 0, tz);
}

/**
 * Converts a specific local date/time in an IANA timezone into a UTC Date.
 */
function localTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string
): Date {
  // Approximate timestamp assuming UTC
  let candidateMs = Date.UTC(year, month - 1, day, hour, minute, second);

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  // Iteratively adjust candidateMs until formatted local time in timeZone matches requested
  for (let iteration = 0; iteration < 3; iteration++) {
    const parts = formatter.formatToParts(new Date(candidateMs));
    const m: Record<string, number> = {};
    for (const p of parts) {
      if (p.type !== 'literal') {
        m[p.type] = parseInt(p.value, 10);
      }
    }

    const localParsedMs = Date.UTC(m.year, m.month - 1, m.day, m.hour, m.minute, m.second);
    const targetMs = Date.UTC(year, month - 1, day, hour, minute, second);
    const diff = targetMs - localParsedMs;

    if (diff === 0) {
      break;
    }
    candidateMs += diff;
  }

  return new Date(candidateMs);
}
