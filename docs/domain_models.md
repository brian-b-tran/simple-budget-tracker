# Domain Models — Expense & Vacation Budget Tracker

## Tables & Fields

### USER
- `id` (uuid, PK)
- `email` (string, unique)
- `passwordHash` (string)
- `currency` (ISO code)
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

### SESSION
- `id` (uuid, PK)
- `userId` (uuid, FK → USER)
- `refreshToken` (string)
- `deviceInfo` (string, optional)
- `createdAt` (datetime)
- `expiresAt` (datetime)
- `revoked` (boolean, default false)
- `revokedAt` (datetime, nullable)

---

### CATEGORY
- `id` (uuid, PK)
- `userId` (uuid, FK → USER)
- `name` (string)
- `isDefault` (boolean)
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

### EXPENSE
- `id` (uuid, PK)
- `userId` (uuid, FK → USER)
- **Original transaction**
  - `amountOriginal` (decimal)
  - `currencyOriginal` (ISO code)
- **Normalized**
  - `amountBase` (decimal)
  - `exchangeRateUsed` (decimal)
- **Classification**
  - `categoryId` (uuid, FK → CATEGORY)
  - `budgetId` (uuid, FK → BUDGET, nullable)
- **Recurrence linkage**
  - `recurringExpenseId` (uuid, FK → RECURRING_EXPENSE, nullable)
- **Metadata**
  - `notes` (string)
  - `date` (UTC)
  - `time` (UTC)
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

### RECURRING_EXPENSE
- `id` (uuid, PK)
- `userId` (uuid, FK → USER)
- `amountOriginal` (decimal)
- `currencyOriginal` (ISO code)
- `categoryId` (uuid, FK → CATEGORY)
- `frequency` (enum: daily, weekly, biweekly, monthly, quarterly, yearly)
- `interval` (int, default 1)
- `startDate` (date)
- `endDate` (date, nullable)
- `nextRunDate` (date)
- `budgetId` (uuid, FK → BUDGET, nullable)
- `notes` (string)
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

### BUDGET
- `id` (uuid, PK)
- `userId` (uuid, FK → USER)
- `name` (string)
- `type` (enum: monthly, vacation, event)
- `currency` (ISO code)
- `totalAmount` (decimal)
- `startDate` (date)
- `endDate` (date)
- `startTime` (time, nullable)
- `endTime` (time, nullable)
- `notes` (string)
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

### REMINDER
- `id` (uuid, PK)
- `userId` (uuid, FK → USER)
- `title` (string)
- `dateTime` (UTC)
- `recurring` (boolean)
- `recurrenceFrequency` (string, nullable)
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

### EXCHANGE_RATE
- `id` (uuid, PK)
- `baseCurrency` (ISO code)
- `targetCurrency` (ISO code)
- `rate` (decimal)
- `fetchedAt` (datetime)

---

## Relationships

User
├─ Categories
├─ Expenses
├─ Budgets
├─ RecurringExpenses
└─ Reminders

Session
└─ Belongs to → User

Expense
├─ Category
├─ Budget (optional)
└─ RecurringExpense (optional)

RecurringExpense
└─ Generates → Expenses

Budget
└─ Contains → Expenses

ExchangeRate
└─ Used by → Expense/Budget normalization


---

## Deletions / Cascades

### User deletion
- Cascade delete:
  - Expenses
  - Budgets
  - Categories
  - RecurringExpenses
  - Reminders
  - Sessions

### Category deletion
- Prevent if expenses exist

### Budget deletion
- Unlink expenses but do not delete

---

## Indexing

### Expense
- `userId`
- `date`
- `categoryId`
- `budgetId`
- `recurringExpenseId`

### RecurringExpense
- `nextRunDate`

### ExchangeRate
- `(baseCurrency, targetCurrency, fetchedAt)`

### Session
- `userId`
- `expiresAt`
- `revoked`
