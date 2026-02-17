# Roadmap — Expense & Vacation Budget Tracker

This roadmap outlines the **planned progression** of the project from MVP to future enhancements. It aligns with the defined milestones.

---

## Phase 1 — Foundation & Core Systems

| Milestone | Focus                     | Description                                                  |
| --------- | ------------------------- | ------------------------------------------------------------ |
| 1         | Project Foundation        | Monorepo setup, Docker, PostgreSQL, basic repo structure     |
| 2         | Authentication & Sessions | JWT + refresh tokens, multi-device login, session management |
| 3         | Core Expense System       | CRUD for expenses and categories, default categories         |
| 4         | Currency & Exchange Rates | Multi-currency support, normalization, rate caching          |

---

## Phase 2 — Budgeting & Automation

| Milestone | Focus                       | Description                                                      |
| --------- | --------------------------- | ---------------------------------------------------------------- |
| 5         | Budget System               | Monthly, vacation, and event budgets; expense linking; summaries |
| 6         | Recurring Expenses + Worker | Automated expense generation, scheduling, nextRunDate updates    |
| 7         | Reminders & Calendar        | Time-based reminders, recurring events, dashboard feeds          |

---

## Phase 3 — Frontend & User Experience

| Milestone | Focus                       | Description                                                           |
| --------- | --------------------------- | --------------------------------------------------------------------- |
| 8         | Frontend MVP (Mobile First) | Expo mobile app, auth screens, expense entry, dashboard views         |
| 9         | Web App                     | Desktop analytics interface using React Native Web, shared components |

---

## Phase 4 — Design & Infrastructure

| Milestone | Focus                             | Description                                                              |
| --------- | --------------------------------- | ------------------------------------------------------------------------ |
| 10        | Design System & UI Infrastructure | Cross-platform color, typography, and component system                   |
| 11        | Production Infrastructure         | Production Docker builds, cloud PostgreSQL, secrets, logging, monitoring |
| 12        | CI/CD & Quality                   | Pipelines, linting, type checks, tests, reproducible builds              |

---

## Phase 5 — Security, Observability & Scaling

| Milestone | Focus                   | Description                                                         |
| --------- | ----------------------- | ------------------------------------------------------------------- |
| 13        | Security Hardening      | Rate limiting, secure sessions, token policies, CORS, audit logging |
| 14        | Observability & Scaling | Structured logging, metrics, worker monitoring, error tracking      |

---

## Phase 6 — Future Enhancements

| Milestone | Focus               | Description                                                                                      |
| --------- | ------------------- | ------------------------------------------------------------------------------------------------ |
| 15        | Future Enhancements | Savings goals, notifications, receipt uploads, multi-currency wallets, AI insights, offline mode |

---

### Notes

- Each milestone builds on the previous; milestones **1–7** establish MVP functionality.  
- Milestones **8–12** focus on user experience, infrastructure, and engineering maturity.  
- Milestones **13–15** address security, observability, and long-term feature expansion.  
- The roadmap is **iterative**: minor adjustments may occur based on user feedback and testing.
