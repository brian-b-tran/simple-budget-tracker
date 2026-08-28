import { Request, Response } from 'express';
import { getCalendarFeedService } from '../services/calendarService';
import z from 'zod';
const calendarFeedQuerySchema = z.object({
  from: z.coerce.date().optional(),
});

export async function getCalendarFeedController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const calendarData = calendarFeedQuerySchema.safeParse(req.query);
    if (!calendarData.success) {
      res.status(400).json({ message: calendarData.error.message });
      return;
    }
    const calendarFeed = await getCalendarFeedService(
      req.user!.userId,
      calendarData.data?.from
    );
    res.status(200).json(calendarFeed);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Service Error.' });
    }
  }
}
