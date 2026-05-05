import { DateRange, RangeKey } from '@expense-app/types/dates';

function getZonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== 'literal') {
      map[p.type] = p.value;
    }
  }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    weekday: map.weekday,
  };
}

function zonedMidnightToUTC(
  year: number,
  month: number,
  day: number,
  timeZone: string
) {
  // Create a date as if it's UTC
  const utcGuess = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

  // Get the timezone offset at that moment
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = formatter.formatToParts(utcGuess);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);

  // Adjust offset
  utcGuess.setUTCHours(utcGuess.getUTCHours() - hour);

  return utcGuess;
}

export function getTodayRange(timeZone: string): DateRange {
  const now = new Date();

  const { year, month, day } = getZonedParts(now, timeZone);

  const start = zonedMidnightToUTC(year, month, day, timeZone);

  return { start, end: now };
}

const weekdayMap: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

export function getWeekRange(timeZone: string): DateRange {
  const now = new Date();

  const { year, month, day, weekday } = getZonedParts(now, timeZone);

  const offset = weekdayMap[weekday];

  const startDate = new Date(Date.UTC(year, month - 1, day - offset));

  const startParts = getZonedParts(startDate, timeZone);

  const start = zonedMidnightToUTC(
    startParts.year,
    startParts.month,
    startParts.day,
    timeZone
  );

  return { start, end: now };
}

export function getMonthRange(timeZone: string): DateRange {
  const now = new Date();

  const { year, month } = getZonedParts(now, timeZone);

  const start = zonedMidnightToUTC(year, month, 1, timeZone);

  return { start, end: now };
}

export function getYearRange(timeZone: string): DateRange {
  const now = new Date();

  const { year } = getZonedParts(now, timeZone);

  const start = zonedMidnightToUTC(year, 1, 1, timeZone);

  return { start, end: now };
}

export function getDateRange(range: RangeKey, timeZone: string): DateRange {
  switch (range) {
    case 'today':
      return getTodayRange(timeZone);
    case 'week':
      return getWeekRange(timeZone);
    case 'month':
      return getMonthRange(timeZone);
    case 'year':
      return getYearRange(timeZone);
  }
}
