-- This is an empty migration.
ALTER TABLE "Expense" ADD COLUMN "isCashPayment" BOOLEAN NOT NULL DEFAULT true;