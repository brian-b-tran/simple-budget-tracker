export type CalendarEventType = 'BUDGET' | 'REMINDER';

export type CalendarEvent = {
  id: string;
  type: CalendarEventType;
  title: string;
  startDate: Date;
  endDate: Date | null;
  metadata: Record<string, unknown>;
};
