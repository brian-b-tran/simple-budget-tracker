import api from './api';
import { Reminder } from '../types/reminderTypes';
import { handleError } from '../utils/serviceUtils';

export const getReminders = async (): Promise<Array<Reminder>> => {
  try {
    const { data } = await api.get<Array<Reminder>>(`/reminders`);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const getUpcomingReminders = async (): Promise<Array<Reminder>> => {
  try {
    const { data } = await api.get<Array<Reminder>>(`/reminders/upcoming`);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};
