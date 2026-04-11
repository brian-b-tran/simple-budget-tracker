import { ExpenseType, BudgetType, Frequency } from '../generated/prisma/client';
import prisma from '../src/config/db';

async function main() {
  const userId = 'bccf7ae8-30ee-441f-b1c6-453d61f1bd25';

  // 1. Create Categories
  const catHousing = await prisma.category.create({
    data: { userId, name: 'Cat Housing', isDefault: false },
  });
  const catFood = await prisma.category.create({
    data: { userId, name: 'Cat Food', isDefault: false },
  });
  const catTransport = await prisma.category.create({
    data: { userId, name: 'Cat Transport', isDefault: false },
  });

  // 2. Create Budget
  const mainBudget = await prisma.budget.create({
    data: {
      userId,
      name: 'Main Monthly',
      type: BudgetType.MONTHLY,
      totalAmount: 4000,
      currency: 'CAD',
    },
  });

  // 3. Create Recurring Expense
  const rentRecurring = await prisma.recurringExpense.create({
    data: {
      userId,
      amountOriginal: 1500,
      currencyOriginal: 'CAD',
      categoryId: catHousing.id,
      frequency: Frequency.MONTHLY,
      startDate: new Date('2026-01-01'),
      nextRunDate: new Date('2026-05-01'),
      budgetId: mainBudget.id,
    },
  });

  // 4. Generate 50 Expenses
  const expenses = [];
  for (let i = 0; i < 50; i++) {
    const isRecurring = i < 5; // First 5 are rent payments
    expenses.push({
      userId,
      amountOriginal: isRecurring ? 1500 : Math.floor(Math.random() * 100) + 10,
      currencyOriginal: 'CAD',
      categoryId: isRecurring
        ? catHousing.id
        : i % 2 === 0
          ? catFood.id
          : catTransport.id,
      budgetId: mainBudget.id,
      recurringExpenseId: isRecurring ? rentRecurring.id : null,
      date: new Date(2026, i % 4, (i % 28) + 1), // Spreads dates across first 4 months
      time: new Date(),
      notes: isRecurring ? 'Monthly Rent' : `Random expense ${i}`,
      type: ExpenseType.EXPENSE,
    });
  }

  await prisma.expense.createMany({ data: expenses });

  //reminders
  const reminders = [
    // One-time
    {
      userId,
      title: 'Pay Electricity Bill',
      dateTime: new Date('2026-03-15T10:00:00'),
      recurring: false,
      notes: 'Account ending in 4492',
    },
    // Recurring Weekly
    {
      userId,
      title: 'Review Weekly Budget',
      dateTime: new Date('2026-04-12T18:00:00'),
      recurring: true,
      recurrenceFrequency: Frequency.WEEKLY,
      interval: 1,
      notes: 'Check for any missing receipts.',
    },
    // Recurring Every 2 Years (Testing interval)
    {
      userId,
      title: 'Replace Water Filter',
      dateTime: new Date('2026-10-01T09:00:00'),
      recurring: true,
      recurrenceFrequency: Frequency.YEARLY,
      interval: 2,
      notes: 'Model: Fridge-Filter-X3',
    },
  ];

  await prisma.reminder.createMany({ data: reminders });
  console.log('Seed data created: 50 Expenses, 1 Budget, 1 Recurring Rule.');
}

main();
