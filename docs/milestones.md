# Project Milestones — Expense & Vacation Budget Tracker

---

## Milestone 1 — Project Foundation
**Goal:** Establish development environment, infrastructure, and repo structure.

### Deliverables
- Monorepo initialized
- Workspace tooling configured
- Base folder structure
- API service scaffolded
- Environment config system
- Docker setup
- Docker Compose config
- Postgres container running
- DB connection established
- Migration tooling added

### Exit Criteria
- `docker compose up` runs successfully
- API connects to Postgres
- Health check endpoint works

---

## Milestone 2 — Authentication & Sessions
**Goal:** Production-grade auth with refresh tokens and multi-device login.

### Deliverables
- User table + migration
- Session table + migration
- Register endpoint
- Login endpoint
- Access token issuance
- Refresh token issuance
- Refresh rotation flow
- Logout endpoint
- Logout-all endpoint
- Session revocation
- Auth middleware
- Protected routes

### Exit Criteria
- Multi-device login works
- Refresh flow rotates tokens
- Revoked sessions blocked

---

## Milestone 3 — Core Expense System
**Goal:** Expense tracking functional end-to-end.

### Deliverables
- Category CRUD
- Default categories seeding
- Expense CRUD
- Expense filtering
- Category linking
- Notes support
- Date/time handling
- Pagination

### Exit Criteria
- User can log, edit, delete expenses
- Category filters work
- Date filtering works

---

## Milestone 4 — Currency & Exchange Rates
**Goal:** Multi-currency financial normalization.

### Deliverables
- ExchangeRate table
- Rate fetch service
- External API integration
- Rate caching
- Historical rate storage
- Currency conversion logic
- Expense normalization
- Budget normalization

### Exit Criteria
- Expenses store original + base currency
- Historical rates preserved
- Conversions deterministic

---

## Milestone 5 — Budget System
**Goal:** Budget tracking across multiple types.

### Deliverables
- Budget CRUD
- Monthly budgets
- Vacation budgets
- Event budgets
- Expense linking
- Spending calculations
- Percentage usage
- Budget summaries

### Exit Criteria
- Budget vs actual visible
- Over-budget detection works

---

## Milestone 6 — Recurring Expenses + Worker
**Goal:** Automated expense generation.

### Deliverables
- RecurringExpense table
- Template CRUD
- Frequency rules
- Interval handling
- Start/end validation
- Worker service
- Cron scheduler
- Expense generation
- nextRunDate updates
- Idempotency safeguards

### Exit Criteria
- Worker generates expenses automatically
- No duplicate generation
- Currency conversion applied

---

## Milestone 7 — Reminders & Calendar
**Goal:** Time-based planning and alerts foundation.

### Deliverables
- Reminder CRUD
- Recurring reminders
- Calendar data model
- Event date/time support
- Upcoming reminders feed

### Exit Criteria
- Reminders visible on dashboard
- Recurring reminders schedule correctly

---

## Milestone 8 — Frontend MVP (Mobile First)
**Goal:** Usable mobile experience.

### Deliverables
- Expo app scaffold
- Navigation system
- Auth screens
- Session persistence
- Expense entry UI
- Category selector
- Budget views
- Dashboard summaries
- Date/time pickers
- Currency display

### Exit Criteria
- User can fully manage finances via mobile

---

## Milestone 9 — Web App
**Goal:** Desktop analytics + planning interface.

### Deliverables
- React Native Web app scaffold
- Shared UI package with mobile
- Auth flows
- Expense tables
- Advanced filters
- Budget planning views
- Responsive layouts

### Exit Criteria
- Web parity with mobile core features

---

## Milestone 10 — Design System & UI Infrastructure
**Goal:** Shared cross-platform design language.

### Deliverables
- Tailwind config
- NativeWind setup
- Theme tokens
- Color system
- Typography scale
- Shared components
- shadcn/ui integration (web)

### Exit Criteria
- UI consistent across mobile + web

---

## Milestone 11 — Production Infrastructure
**Goal:** Deployment readiness.

### Deliverables
- Production Docker builds
- Cloud Postgres
- Secrets management
- Environment separation
- Logging setup
- Health monitoring

### Exit Criteria
- App deployable to cloud infra

---

## Milestone 12 — CI/CD & Quality
**Goal:** Engineering maturity + automation.

### Deliverables
- GitHub Actions pipelines
- Linting
- Type checks
- Test runners
- Build verification
- Docker build CI
- Migration checks

### Exit Criteria
- PRs auto-validated
- Builds reproducible

---

## Milestone 13 — Security Hardening
**Goal:** Production security posture.

### Deliverables
- Rate limiting
- Brute force protection
- Token expiry policies
- Secure cookie config
- CORS policies
- Helmet headers
- Audit logging

### Exit Criteria
- Auth abuse mitigated
- Sessions secure

---

## Milestone 14 — Observability & Scaling
**Goal:** Operability at scale.

### Deliverables
- Structured logging
- Metrics collection
- Worker monitoring
- Queue metrics (future)
- Error tracking

### Exit Criteria
- Failures observable
- Workers traceable

---

## Milestone 15 — Future Enhancements
**Goal:** Post-MVP innovation layer.

### Deliverables
- Savings goals
- Notifications
- Receipt uploads
- Multi-currency wallets
- AI spending insights
- Offline mode

### Exit Criteria
- Feature backlog ready for iteration
