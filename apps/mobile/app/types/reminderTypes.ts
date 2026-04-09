export interface Reminder {
  title: string;
  dateTime: string;
  recurring: boolean;
  recurrenceFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  notes?: string;
  interval: number;
}
