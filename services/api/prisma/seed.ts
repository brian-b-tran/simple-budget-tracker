import bcrypt from 'bcrypt';
import { ExpenseType, BudgetType, Frequency } from '../generated/prisma/client';
import prisma from '../src/config/db';

const SALT_ROUNDS = 10;

async function createTestUser(email: string, plainPassword: string) {
  const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      currency: 'CAD',
    },
  });

  return user;
}

async function seedUserData(
  userId: string,
  opts: { labelPrefix: string; monthlyTotal: number; vacationName: string }
) {
  // 1. Categories
  const catHousing = await prisma.category.create({
    data: { userId, name: `${opts.labelPrefix} Housing`, isDefault: false },
  });
  const catFood = await prisma.category.create({
    data: { userId, name: `${opts.labelPrefix} Food`, isDefault: false },
  });
  const catTransport = await prisma.category.create({
    data: { userId, name: `${opts.labelPrefix} Transport`, isDefault: false },
  });

  // 2. Monthly budget
  const mainBudget = await prisma.budget.create({
    data: {
      userId,
      name: `${opts.labelPrefix} Main Monthly`,
      type: BudgetType.MONTHLY,
      totalAmount: opts.monthlyTotal,
      currency: 'CAD',
    },
  });

  // 3. VACATION budget with real dates — exercises the calendar feed +
  // the startDate/endDate invariant we just finished enforcing
  const vacationBudget = await prisma.budget.create({
    data: {
      userId,
      name: opts.vacationName,
      type: BudgetType.VACATION,
      totalAmount: 2000,
      currency: 'CAD',
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-27'),
    },
  });

  // 4. Recurring expense (rent)
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

  // 5. 50 expenses
  const expenses = [];
  for (let i = 0; i < 50; i++) {
    const isRecurring = i < 5; // first 5 are rent payments
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
      date: new Date(2026, i % 4, (i % 28) + 1),
      time: new Date(),
      notes: isRecurring ? 'Monthly Rent' : `Random expense ${i}`,
      type: ExpenseType.EXPENSE,
    });
  }
  await prisma.expense.createMany({ data: expenses });

  // 6. Reminders
  const reminders = [
    {
      userId,
      title: `${opts.labelPrefix} Pay Electricity Bill`,
      dateTime: new Date('2026-09-15T10:00:00'),
      recurring: false,
      notes: 'Account ending in 4492',
    },
    {
      userId,
      title: `${opts.labelPrefix} Review Weekly Budget`,
      dateTime: new Date('2026-09-05T18:00:00'),
      recurring: true,
      recurrenceFrequency: Frequency.WEEKLY,
      interval: 1,
      notes: 'Check for any missing receipts.',
    },
    {
      userId,
      title: `${opts.labelPrefix} Replace Water Filter`,
      dateTime: new Date('2026-10-01T09:00:00'),
      recurring: true,
      recurrenceFrequency: Frequency.YEARLY,
      interval: 2,
      notes: 'Model: Fridge-Filter-X3',
    },
  ];
  await prisma.reminder.createMany({ data: reminders });

  return { mainBudget, vacationBudget, rentRecurring };
}

async function main() {
  const userOne = await createTestUser('user.test1@example.com', 'password123');
  await seedUserData(userOne.id, {
    labelPrefix: 'U1',
    monthlyTotal: 4000,
    vacationName: 'Japan Trip',
  });

  const userTwo = await createTestUser('user.test2@example.com', 'password123');
  await seedUserData(userTwo.id, {
    labelPrefix: 'U2',
    monthlyTotal: 3200,
    vacationName: 'Banff Getaway',
  });

  console.log(
    'Seed complete: 2 users, each with categories, budgets (incl. 1 VACATION), 50 expenses, 1 recurring rule, 3 reminders.'
  );
  console.log(
    `User 1 login: user.test1@example.com / password123 (id: ${userOne.id})`
  );
  console.log(
    `User 2 login: user.test2@example.com / password123 (id: ${userTwo.id})`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
