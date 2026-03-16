import { Request, Response } from 'express';
import {
  getExchangeRateService,
  getMultiExchangeRatesService,
  convertAmountService,
} from '../services/exchangeRateService';

export async function getExchangeRateController(
  req: Request,
  res: Response
): Promise<void> {
  const { base, target } = req.params;
  try {
    const rate = await getExchangeRateService(base as string, target as string);
    res.status(200).json(rate);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function getMultiExchangeRatesController(
  req: Request,
  res: Response
): Promise<void> {
  const { base, targets } = req.query;
  const targetsArray = (targets as string).split(',');
  try {
    const rates = await getMultiExchangeRatesService(
      base as string,
      targetsArray
    );
    res.status(200).json(rates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function convertAmountController(
  req: Request,
  res: Response
): Promise<void> {}
