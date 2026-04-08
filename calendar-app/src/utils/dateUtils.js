import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isToday as isTodayFn,
  addMonths,
  subMonths,
  isBefore,
  isAfter,
  isWeekend as isWeekendFn,
} from 'date-fns';

/**
 * Generate the 6×7 grid of days for a given month.
 * Week starts on Monday (weekStartsOn: 1).
 */
export function getCalendarDays(year, month) {
  const date = new Date(year, month, 1);
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

/**
 * Check if a date falls within a range [rangeStart, rangeEnd].
 * Handles reverse selection automatically.
 */
export function isInRange(date, rangeStart, rangeEnd) {
  if (!rangeStart || !rangeEnd) return false;
  const start = isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd;
  const end = isAfter(rangeStart, rangeEnd) ? rangeStart : rangeEnd;
  return (isSameDay(date, start) || isAfter(date, start)) &&
         (isSameDay(date, end) || isBefore(date, end));
}

/**
 * Check if a date is the start of a range.
 */
export function isRangeStart(date, rangeStart, rangeEnd) {
  if (!rangeStart || !rangeEnd) return false;
  const start = isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd;
  return isSameDay(date, start);
}

/**
 * Check if a date is the end of a range.
 */
export function isRangeEnd(date, rangeStart, rangeEnd) {
  if (!rangeStart || !rangeEnd) return false;
  const end = isAfter(rangeStart, rangeEnd) ? rangeStart : rangeEnd;
  return isSameDay(date, end);
}

/**
 * Generate a unique key for a date to use in localStorage.
 */
export function dateKey(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get all dates in a range as an array.
 */
export function getDatesInRange(rangeStart, rangeEnd) {
  if (!rangeStart) return [];
  if (!rangeEnd) return [rangeStart];
  const start = isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd;
  const end = isAfter(rangeStart, rangeEnd) ? rangeStart : rangeEnd;
  return eachDayOfInterval({ start, end });
}

export {
  format,
  isSameDay,
  isSameMonth,
  isTodayFn as isToday,
  addMonths,
  subMonths,
  isBefore,
  isAfter,
  isWeekendFn as isWeekend,
};
