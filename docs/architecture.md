# Architecture Overview — Expense & Vacation Budget Tracker

## Table of Contents

1. [High Level Overview](#1-high-level-overview)
2. [Tech Stack](#2-tech-stack)
3. [API Routes Overview](#3-api-routes-overview)
4. [Services](#4-services)
5. [Background Workers](#5-background-workers)
6. [Database & Domain Models](#6-database--domain-models)
7. [Repo Structure](#7-repo-structure)

---

## 1. High Level Overview

Client Apps
├─ React Native Mobile App (Expo + NativeWind)
└─ React Native Web App (Expo Web + shadcn/ui)

API Layer
└─ Backend REST API (Node + Express + TypeScript)

Services
├─ Auth Service
├─ Session Service
├─ User Service
├─ Expense Service
├─ Budget Service
├─ Reminder Service
├─ Currency Service
└─ Recurring Expense Service

Background Workers
└─ Recurring Expense Worker

Data Layer
├─ PostgreSQL
└─ Exchange Rate Cache

Infra
├─ Docker
├─ Docker Compose (local dev)
└─ Cloud (AWS/GCP/Vercel/etc.)


---

## 2. Tech Stack

### Frontend:
- React Native (Expo)
- React Native Web
- NativeWind/Tailwind
- shadcn/ui (web)
- TypeScript

### Backend:

- Node.js + Express

- TypeScript

- Zod for validation

- JWT + OAuth for authentication

### Database:

- PostgreSQL
- Sequelize/TypeORM or Prisma (optional ORM)

### Auth:
- JWT access & refresh tokens
- Multi-device session handling

### DevOps:
- Docker + Docker Compose
- GitHub Actions for CI/CD
- Logging & monitoring (future)

---

## 3. API Routes Overview

- **Auth:** `/auth/register`, `/auth/login`, `/auth/me`, `/auth/logout`, `/auth/logout-all`, `/auth/refresh`
- **Session:** `/sessions` (list/revoke)
- **User:** `/user/:id` CRUD
- **Expense:** `/expenses` CRUD, filtering
- **Budget:** `/budgets` CRUD, summaries
- **Reminder:** `/reminders` CRUD
- **RecurringExpense:** `/recurring-expenses` CRUD
- **Currency:** `/currencies/convert`, `/currencies/rates`

---

## 4. Services

### Auth Service
**Responsibilities:**
- User registration/login
- Password hashing
- OAuth integration (future)
- JWT token issuance & validation

**Boundaries:**
- Only handles authentication logic
- Delegates session management to Session Service

---

### Session Service
**Responsibilities:**
- Track active sessions per user/device
- Issue, rotate, and revoke refresh tokens
- Handle logout & logout-all endpoints

**Boundaries:**
- Does not authenticate passwords
- Does not handle expense/budget logic

---

### User Service
**Responsibilities:**
- Profile management
- Base currency preference
- Account updates and deletion

**Boundaries:**
- Delegates authentication to Auth Service
- Provides user info to other services

---

### Expense Service
**Responsibilities:**
- CRUD for expenses
- Category linking
- Budget linking
- Normalization via Currency Service
- Optional recurring expense association

**Boundaries:**
- Cannot create users
- Cannot generate recurring expenses (delegated to worker)

---

### Budget Service
**Responsibilities:**
- CRUD for monthly, vacation, event budgets
- Calculate totals, remaining budget, % usage
- Provide budget summaries

**Boundaries:**
- Reads expenses but does not create them
- Does not handle reminders

---

### Reminder Service
**Responsibilities:**
- CRUD reminders
- Optional recurring rules
- Serve upcoming reminders feed

**Boundaries:**
- Does not notify users directly
- Does not handle expenses or budgets

---

### Currency Service
**Responsibilities:**
- Fetch live exchange rates
- Store historical rates
- Convert amounts to base/target currency
- Provide normalized values

**Boundaries:**
- Stateless; does not store expenses/budgets
- Called by Expense/Budget/Recurring Expense services

---

### Recurring Expense Service
**Responsibilities:**
- Manage recurring templates
- Store frequency, interval, next run date
- Validate recurrence rules
- Link to budgets and categories

**Boundaries:**
- Does not generate expense instances (handled by Worker)
- Does not manage currencies directly

---

## 5. Background Workers

### Recurring Expense Worker
**Responsibilities:**
- Run scheduled tasks (cron)
- Generate expense instances from recurring templates
- Apply exchange rate conversions
- Update nextRunDate
- Optional logging/auditing

**Inputs:**
- RecurringExpense table
- ExchangeRate table (via Currency Service)
- User base currency

**Outputs:**
- Expenses
- Updates to recurring templates

**Failure Handling:**
- Retry failed generation
- Idempotent operations
- Alert/log failures

**Deployment:**
- Runs in own Docker container
- Independent scaling
- Scheduler via cron or queue system

---

## 6. Database & Domain Models

**Tables:**
- User
- Session
- Category
- Expense
- Budget
- RecurringExpense
- Reminder
- ExchangeRate

**Relationships:**

User
├─ Categories
├─ Expenses
├─ Budgets
├─ RecurringExpenses
└─ Reminders

Expense
├─ Category
├─ Budget (optional)
└─ RecurringExpense (optional)

RecurringExpense
└─ Generates → Expenses

Budget
└─ Contains → Expenses

ExchangeRate
└─ Used by → Expense conversion

Session
└─ Tracks user login devices and tokens


**Notes:**
- All monetary values stored in decimal
- Dates stored in UTC, converted for display
- Cascading deletions for user-related data

---

## 7. Repo Structure

expense-tracker/
│
├─ apps/
│ ├─ mobile/ # React Native (Expo) app
│ └─ web/ # React Native Web app
│
├─ services/
│ └─ api/ # Express services (Auth, Expense, Budget, etc.)
│
├─ packages/
│ ├─ ui/ # Shared UI components
│ ├─ types/ # Shared TypeScript types
│ └─ currency/ # Currency helper libraries
│
├─ docker/ # Dockerfiles and compose configs
├─ migrations/ # Database migrations
└─ docs/ # Architecture, requirements, PRD, milestones, issues