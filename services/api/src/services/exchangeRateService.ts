import { ExchangeRate } from '../../generated/prisma/client';
import prisma from '../config/db';
interface FrankfurterResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}
export async function getExchangeRateService(
  baseCurrency: string,
  targetCurrency: string
): Promise<ExchangeRate> {}

export async function getExchangeRatesService(
  baseCurrency: string,
  targetCurrencies: string
): Promise<Array<ExchangeRate>> {}

async function fetchAndStoreRates(
  baseCurrency: string,
  targetCurrencies: Array<string>
): Promise<Array<ExchangeRate>> {
  const fetchString = `https://api.frankfurter.app/latest?from=${baseCurrency}&to=${targetCurrencies.join(',')}`;

  try {
    const response = await fetch(fetchString);
    if (!response.ok) {
      throw new Error(`Frankfurter API error: ${response.status}`);
    }
    const data = (await response.json()) as FrankfurterResponse;
    const exchangeRates = [];
    for (const [targetCurrency, rate] of Object.entries(data.rates)) {
      exchangeRates.push({
        baseCurrency: baseCurrency,
        targetCurrency: targetCurrency,
        rate: rate,
      });
    }
    const result = await prisma.exchangeRate.createManyAndReturn({
      data: exchangeRates,
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      throw new Error(
        `Failed to fetch exchange rates: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
  return [];
}

function convertAmount(
  amount: number,
  baseCurrency: number,
  targetCurrency
): number {}
