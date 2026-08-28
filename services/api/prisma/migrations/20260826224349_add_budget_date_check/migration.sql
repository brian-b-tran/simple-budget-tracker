-- Adding CHECK to Budget table for empty start and end dates.
ALTER TABLE "Budget"
ADD CONSTRAINT budget_dated_type_requires_dates
CHECK ( "type" NOT IN ('VACATION', 'EVENT') OR ("startDate" IS NOT NULL AND "endDate" IS NOT NULL) );