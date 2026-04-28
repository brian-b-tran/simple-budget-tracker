export interface Reminder {
  id: string;
  title: string;
  dateTime: string;
  recurring: boolean;
  recurrenceFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  notes?: string;
  interval: number;
}
