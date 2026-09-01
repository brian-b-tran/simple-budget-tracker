import { DateRange } from '@expense-app/types';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const dateFormatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return dateFormatted;
}

export function formatTime(timeString: string): string {
  const time = new Date(timeString);
  const timeFormatted = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(time);
  return timeFormatted;
}

export function daysBetween(a: Date, b: Date): number {
  const aUTC = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const bUTC = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((bUTC - aUTC) / 86400000);
}
