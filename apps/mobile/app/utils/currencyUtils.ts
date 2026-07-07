import { Expense, FormattedExpenseAmount } from '../types/expenseTypes';

export function formatCurrency(
  amount: number,
  currencyCode: string,
  locale: string = 'en-CA'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

export function formatExpenseAmount(
  expense: Expense,
  userCurrency: string,
  locale: string = 'en-CA'
): FormattedExpenseAmount {
  const formatted: FormattedExpenseAmount = {
    amountOriginalString: formatCurrency(
      expense.amountOriginal,
      expense.currencyOriginal,
      locale
    ),
  };
  if (expense.currencyOriginal !== userCurrency && expense.amountBase) {
    formatted.amountConvertedString = formatCurrency(
      expense.amountBase,
      userCurrency,
      locale
    );
  }

  return formatted;
}
