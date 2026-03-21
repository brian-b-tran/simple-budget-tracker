-- Remove BIWEEKLY and QUARTERLY from Frequency enum
ALTER TYPE "Frequency" RENAME TO "Frequency_old";
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
ALTER TABLE "RecurringExpense" ALTER COLUMN "frequency" TYPE "Frequency" USING "frequency"::text::"Frequency";
ALTER TABLE "Reminder" ALTER COLUMN "recurrenceFrequency" TYPE "Frequency" USING "recurrenceFrequency"::text::"Frequency";
DROP TYPE "Frequency_old";

-- Create Reminder table
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceFrequency" "Frequency",
    "notes" TEXT,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- Add foreign key
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;