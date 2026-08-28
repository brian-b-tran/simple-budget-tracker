import { CalendarEvent } from '../types/calendarTypes';
import { handleError } from '../utils/serviceUtils';
import api from './api';

export const getCalendarFeedService = async (
  from?: Date
): Promise<Array<CalendarEvent>> => {
  try {
    const { data } = await api.get<Array<CalendarEvent>>(`/calendar`, {
      params: {
        from: from || undefined,
      },
    });
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};
