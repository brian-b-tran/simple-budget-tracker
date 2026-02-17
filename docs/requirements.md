# Product Requirements Document (PRD)

## Table of Contents

- [Product Requirements Document (PRD)](#product-requirements-document-prd)
  - [Table of Contents](#table-of-contents)
- [1. Product Overview](#1-product-overview)
  - [1.1 Product Name](#11-product-name)
  - [1.2 Description](#12-description)
- [2. Goals \& Objectives](#2-goals--objectives)
  - [2.1 User Goals](#21-user-goals)
  - [2.2 Product Goals](#22-product-goals)
- [3. Target Users](#3-target-users)
  - [3.1 Primary Users](#31-primary-users)
  - [3.2 Usage Context](#32-usage-context)
- [4. Features \& Functional Requirements](#4-features--functional-requirements)
  - [4.1 Authentication \& User Management](#41-authentication--user-management)
    - [Description](#description)
    - [Functional Requirements](#functional-requirements)
    - [Validation Rules](#validation-rules)
  - [4.2 Expense Management](#42-expense-management)
    - [Description](#description-1)
    - [Functional Requirements](#functional-requirements-1)
    - [Validation Rules](#validation-rules-1)
  - [4.3 Categories](#43-categories)
    - [Description](#description-2)
    - [Functional Requirements](#functional-requirements-2)
    - [Default Categories](#default-categories)
  - [4.4 Budgets](#44-budgets)
    - [Description](#description-3)
    - [Functional Requirements](#functional-requirements-3)
    - [Validation Rules](#validation-rules-2)
  - [4.5 Recurring Expenses](#45-recurring-expenses)
    - [Description](#description-4)
    - [Functional Requirements](#functional-requirements-4)
    - [Validation Rules](#validation-rules-3)
  - [4.6 Reminders \& Calendar](#46-reminders--calendar)
    - [Description](#description-5)
    - [Functional Requirements](#functional-requirements-5)
    - [Validation Rules](#validation-rules-4)
  - [4.7 Currency \& Multi-Currency Support](#47-currency--multi-currency-support)
    - [Description](#description-6)
    - [Functional Requirements](#functional-requirements-6)
    - [Validation Rules](#validation-rules-5)
- [5. Platform Requirements](#5-platform-requirements)
  - [5.1 Mobile Application](#51-mobile-application)
  - [5.2 Web Application](#52-web-application)
- [6. User Flows](#6-user-flows)
- [7. Data \& Permissions](#7-data--permissions)
- [8. Non-Functional Requirements](#8-non-functional-requirements)
  - [8.1 Performance](#81-performance)
  - [8.2 Security](#82-security)
  - [8.3 Usability](#83-usability)
- [9. Edge Cases](#9-edge-cases)
- [10. Future Enhancements](#10-future-enhancements)
- [11. MVP Scope Definition](#11-mvp-scope-definition)
    - [Included](#included)
    - [Excluded](#excluded)

---

# 1. Product Overview

## 1.1 Product Name

**Expense & Vacation Budget Tracker**

## 1.2 Description

A mobile-first application (with web support) that allows users to track personal expenses, manage monthly and event/vacation budgets, plan spending, handle multi-currency scenarios, and automate recurring payments. The platform emphasizes usability, transparency, and accurate financial insights.

---

# 2. Goals & Objectives

## 2.1 User Goals

- Track daily and ad-hoc expenses.
- Stay within monthly budgets.
- Plan and manage vacation or event finances.
- Handle multiple currencies for global spending.
- Automate recurring expenses.
- Receive reminders for planned expenses/events.

## 2.2 Product Goals

- Provide clear, actionable financial insights.
- Encourage adherence to budgets.
- Simplify expense entry, categorization, and tracking.
- Enable multi-device access with secure session handling.

---

# 3. Target Users

## 3.1 Primary Users

- Individuals managing personal finances.
- Budget-conscious users.
- Travelers planning vacations or events.
- Users with recurring monthly or subscription expenses.

## 3.2 Usage Context

- **Mobile:** Quick expense entry, vacation/event planning, dashboards on the go.
- **Web:** Detailed reports, analytics, bulk management, and planning.

---

# 4. Features & Functional Requirements

## 4.1 Authentication & User Management

### Description

Handles account creation, authentication, session management, and multi-device access.

### Functional Requirements

The system shall allow users to:

1. Register with email/password.
2. Login and logout.
3. Maintain multiple active sessions across devices.
4. Issue access tokens and refresh tokens.
5. Rotate refresh tokens securely.
6. Revoke individual sessions or all sessions.
7. Reset/change password.
8. Delete account.

### Validation Rules

- Email must be unique.
- Password must meet complexity requirements.
- Passwords stored hashed and salted.
- Access tokens expire; refresh tokens rotated securely.

---

## 4.2 Expense Management

### Description

Log and manage financial transactions.

### Functional Requirements

- Create, edit, delete expenses.
- Assign expenses to categories.
- Link expenses to budgets (optional).
- Support notes, dates, and times.
- Handle original currency and normalized base currency.
- Filter by date, category, amount, budget association.
- Pagination for large datasets.

### Validation Rules

- Amount must be positive.
- Date/time must be valid.
- Category must exist for the user.

---

## 4.3 Categories

### Description

Classify expenses for reporting and budget tracking.

### Functional Requirements

- Create, edit, delete categories.
- Assign categories to expenses.
- Default categories seeded for new users.

### Default Categories

- Food, Transport, Housing, Entertainment, Shopping, Travel

---

## 4.4 Budgets

### Description

Manage spending limits.

### Functional Requirements

- CRUD for monthly, vacation, and event budgets.
- Link expenses to budgets.
- Calculate total spent, remaining, and percentage used.
- Show budget summaries on dashboards.

### Validation Rules

- End date ≥ start date.
- Over-budget detection.

---

## 4.5 Recurring Expenses

### Description

Automate repeated transactions.

### Functional Requirements

- Define recurring templates (amount, category, currency, frequency, interval, start/end date).
- Generate expenses automatically via worker process.
- Maintain idempotency.
- Update next run date after generation.

### Validation Rules

- Frequency options: daily, weekly, biweekly, monthly, quarterly, yearly.
- Recurring expenses linked to optional budgets.
- Cannot generate duplicates.

---

## 4.6 Reminders & Calendar

### Description

Notify and plan upcoming expenses, vacations, or events.

### Functional Requirements

- CRUD for reminders and events.
- Support recurring reminders.
- Calendar feed integration.
- Date/time validation.

### Validation Rules

- Event times cannot overlap for same user.
- Vacation date ranges cannot overlap.
- Reminders properly propagate to dashboard.

---

## 4.7 Currency & Multi-Currency Support

### Description

Support spending in multiple currencies.

### Functional Requirements

- Record expense in original currency.
- Convert to user base currency using latest exchange rates.
- Store historical exchange rates.
- Normalize budgets across currencies.
- Support multi-currency planning for vacations.

### Validation Rules

- Base currency configurable per user.
- Exchange rate updates daily or on-demand.

---

# 5. Platform Requirements

## 5.1 Mobile Application

- Mobile-first design using React Native + Expo.
- Bottom tab navigation.
- Quick expense entry.
- Dashboards with summaries.
- Date/time pickers in modals.
- NativeWind/Tailwind for styling.

## 5.2 Web Application

- React Native Web + shared UI.
- Analytics and bulk operations.
- Responsive layouts.
- Dashboard and budget planning views.

---

# 6. User Flows

1. **Expense Logging:** Login → Add expense → Save → Dashboard updates.
2. **Budget Tracking:** Set budget → Log expenses → View usage → Alerts on limit.
3. **Vacation Planning:** Create vacation → Set budget → Add expenses → View remaining funds.

---

# 7. Data & Permissions

- User can only access own data.
- Categories, budgets, vacations, and reminders are user-scoped.
- All dates stored in UTC; displayed in user’s timezone.
- Sensitive endpoints require JWT auth.

---

# 8. Non-Functional Requirements

## 8.1 Performance

- Dashboard loads <2s.
- Queries paginated.

## 8.2 Security

- JWT authentication.
- Password hashing.
- Protected API routes.
- Secure cookie flags and CORS policies (handled in later milestones).

## 8.3 Usability

- Mobile-first responsive design.
- Accessible forms.
- Proper currency and date formatting.

---

# 9. Edge Cases

- Expense without category → reject.
- Vacation overspending → allow but flagged.
- Deleting category with expenses → prevent.
- Budget amount = 0 → treat as unlimited.

---

# 10. Future Enhancements

- Recurring expenses with reminders.
- Savings goals.
- Receipt uploads.
- Multi-currency wallets.
- Notifications and push alerts.
- AI spending insights.

---

# 11. MVP Scope Definition

### Included

- Authentication & sessions
- Expense CRUD
- Categories
- Monthly, vacation, event budgets
- Dashboard summaries

### Excluded

- Charts
- Notifications
- AI features
- Offline mode
