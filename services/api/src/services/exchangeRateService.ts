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
): Promise<ExchangeRate> {
  const exchangeRate = await prisma.exchangeRate.findFirst({
    where: { baseCurrency: baseCurrency, targetCurrency: targetCurrency },
    orderBy: { fetchedAt: 'desc' },
  });
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  if (!exchangeRate || exchangeRate.fetchedAt.getTime() < twentyFourHoursAgo) {
    const fetchedRates = await fetchAndStoreRates(baseCurrency, [
      targetCurrency,
    ]);
    return fetchedRates[0];
  } else {
    return exchangeRate;
  }
}

export async function getMultiExchangeRatesService(
  baseCurrency: string,
  targetCurrencies: Array<string>
): Promise<Array<ExchangeRate>> {
  const exchangeRates = await prisma.exchangeRate.findMany({
    where: {
      baseCurrency: baseCurrency,
      targetCurrency: { in: targetCurrencies },
    },
    orderBy: { fetchedAt: 'desc' },
  });

  //if some cached rates exist find any missing and fetch before returning
  if (exchangeRates.length != 0) {
    const cachedCurrencies = exchangeRates.map((rate) => rate.targetCurrency);
    const missingCurrencies = targetCurrencies.filter(
      (cached) => !cachedCurrencies.includes(cached)
    );
    const outDatedRates = [];
    const returnRates = [];
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    for (let i = 0; i < exchangeRates.length; i++) {
      if (exchangeRates[i].fetchedAt.getTime() < twentyFourHoursAgo) {
        outDatedRates.push(exchangeRates[i].targetCurrency);
      } else {
        returnRates.push(exchangeRates[i]);
      }
    }

    const toFetch = [...outDatedRates, ...missingCurrencies];
    if (toFetch.length > 0) {
      const fetchedRates = await fetchAndStoreRates(baseCurrency, toFetch);
      returnRates.push(...fetchedRates);
    }

    return returnRates;
  }

  //else no cached rates fetch new currencies and return
  const fetchedRates = await fetchAndStoreRates(baseCurrency, targetCurrencies);
  return fetchedRates;
}

export async function convertAmountService(
  amount: number,
  baseCurrency: string,
  targetCurrency: string
): Promise<number> {
  const rate = await getExchangeRateService(baseCurrency, targetCurrency);
  return rate.rate.mul(amount).toNumber();
}

export async function fetchAndStoreRates(
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
