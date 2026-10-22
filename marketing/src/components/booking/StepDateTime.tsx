import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isBefore, isSameMonth, startOfDay, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { SlotDay } from '../../api/types';
import { cn } from '../../lib/cn';

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function StepDateTime({
  slots,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  loading,
}: {
  slots: SlotDay[];
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  loading: boolean;
}) {
  const today = startOfDay(new Date());
  const [cursor, setCursor] = useState(startOfMonth(today));

  const availableDates = useMemo(() => {
    const set = new Set<string>();
    slots.forEach((day) => {
      if (day.slots.some((slot) => slot.available)) set.add(day.date);
    });
    return set;
  }, [slots]);

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 }),
      }),
    [cursor],
  );

  const selectedDay = slots.find((day) => day.date === selectedDate);

  return (
    <fieldset>
      <legend className="text-xl font-bold text-ink-900">Pick a date and time</legend>
      <p className="mt-1 text-sm text-ink-500">
        Greyed-out times are already taken. Evening slots between 5 and 7 PM fill fastest, so grab one early if you
        can.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCursor((date) => subMonths(date, 1))}
              aria-label="Previous month"
              className="flex size-9 items-center justify-center rounded-full border border-line text-ink-500 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <p className="text-sm font-bold text-ink-900">{format(cursor, 'MMMM yyyy')}</p>
            <button
              type="button"
              onClick={() => setCursor((date) => addMonths(date, 1))}
              aria-label="Next month"
              className="flex size-9 items-center justify-center rounded-full border border-line text-ink-500 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
            {weekdayLabels.map((label) => (
              <div key={label} className="py-1 text-[11px] font-bold uppercase tracking-wide text-ink-400">
                {label}
              </div>
            ))}

            {days.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const isPast = isBefore(day, today);
              const hasSlots = availableDates.has(key);
              const isSelected = selectedDate === key;
              const inMonth = isSameMonth(day, cursor);

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isPast || !hasSlots}
                  onClick={() => onSelectDate(key)}
                  aria-pressed={isSelected}
                  aria-label={`${format(day, 'EEEE d MMMM')}${hasSlots ? ' — slots available' : ' — no slots available'}`}
                  className={cn(
                    'relative flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all',
                    isSelected && 'bg-brand-600 text-white shadow-soft',
                    !isSelected && inMonth && !isPast && hasSlots && 'text-ink-800 hover:bg-mint-50 hover:text-brand-700',
                    !isSelected && inMonth && !isPast && !hasSlots && 'text-ink-300',
                    (!inMonth || isPast) && 'text-ink-200',
                    isSelected && 'text-white',
                  )}
                >
                  {format(day, 'd')}
                  {!isSelected && hasSlots && !isPast && (
                    <span
                      className="absolute bottom-1.5 size-1 rounded-full bg-brand-500"
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-ink-900">
            <Clock3 className="size-4 text-brand-600" aria-hidden />
            {selectedDate
              ? format(new Date(`${selectedDate}T00:00:00`), 'EEEE d MMMM')
              : 'Select a date to see times'}
          </p>

          {loading && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }, (_, index) => (
                <span key={index} className="h-10 animate-pulse rounded-xl bg-ink-100" aria-hidden />
              ))}
            </div>
          )}

          {!loading && !selectedDate && (
            <p className="mt-4 rounded-xl bg-mint-50 px-4 py-6 text-center text-sm text-brand-900">
              Choose a day on the calendar and we will show you every open slot.
            </p>
          )}

          {!loading && selectedDate && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {selectedDay?.slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => onSelectTime(slot.time)}
                  aria-pressed={selectedTime === slot.time}
                  className={cn(
                    'h-10 rounded-xl border text-sm font-semibold transition-all',
                    selectedTime === slot.time
                      ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                      : slot.available
                        ? 'border-line bg-white text-ink-800 hover:border-brand-400 hover:bg-mint-50 hover:text-brand-700'
                        : 'cursor-not-allowed border-line bg-ink-50 text-ink-300 line-through',
                  )}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          )}

          {!loading && selectedDate && selectedDay?.slots.every((slot) => !slot.available) && (
            <p className="mt-4 rounded-xl bg-accent-50 px-4 py-4 text-center text-sm text-accent-700">
              That day is fully booked. Try another date — or ask our assistant to find the next free slot.
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}
