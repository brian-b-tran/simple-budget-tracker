import { Request, Response } from 'express';

const getHealth = async (req: Request, res: Response): Promise<void> => {
  res
    .status(200)
    .json({
      status: 'ok',
      uptime: process.uptime(),
      message: 'Expense API Running.',
    });
};

export { getHealth };
