import { Request, Response } from 'express';
import { getCalendarFeedService } from '../services/calendarService';

export async function getCalendarFeedController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const calendarFeed = await getCalendarFeedService(req.user!.userId);
    res.status(200).json(calendarFeed);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Service Error.' });
    }
  }
}
