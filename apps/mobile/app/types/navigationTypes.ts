export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  ExpenseDetail: { expenseId: string };
  RecurringExpenseDetail: { recurringId: string };
  BudgetDetail: { budgetId: string };
  ReminderDetail: { reminderId: string };
};
