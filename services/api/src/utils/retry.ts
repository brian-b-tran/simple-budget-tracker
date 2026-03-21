import logger from './logger';

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  let attempts = 0;
  let lastError: unknown;
  while (attempts < maxRetries) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      logger.error('Operation failed, retrying...', {
        attempt: attempts + 1,
        maxRetries,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      lastError = error;
      const delay = baseDelay * Math.pow(2, attempts);
      attempts++;
      if (attempts < maxRetries) {
        await sleep(delay);
      }
    }
  }
  throw lastError;
}
