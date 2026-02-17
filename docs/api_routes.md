# API Routes — Expense & Vacation Budget Tracker

All endpoints require **JWT authentication** unless otherwise noted.

---

## Auth

| Method | Endpoint         | Description                               |
| ------ | ---------------- | ----------------------------------------- |
| POST   | /auth/register   | Register a new user                       |
| POST   | /auth/login      | Login and receive access + refresh tokens |
| POST   | /auth/refresh    | Refresh access token                      |
| POST   | /auth/logout     | Logout current session                    |
| POST   | /auth/logout-all | Logout all sessions                       |
| GET    | /auth/me         | Get authenticated user info               |

---

## Users

| Method | Endpoint   | Description                              |
| ------ | ---------- | ---------------------------------------- |
| GET    | /users/:id | Retrieve user profile                    |
| PUT    | /users/:id | Update user info (email, currency, etc.) |
| DELETE | /users/:id | Delete user account and all related data |

---

## Expenses

| Method | Endpoint         | Description                                            |
| ------ | ---------------- | ------------------------------------------------------ |
| GET    | /expenses        | List all user expenses                                 |
| POST   | /expenses        | Create a new expense                                   |
| GET    | /expenses/:id    | Get a single expense                                   |
| PUT    | /expenses/:id    | Update an expense                                      |
| DELETE | /expenses/:id    | Delete an expense                                      |
| GET    | /expenses/filter | Filter expenses (date range, category, budget, amount) |

---

## Recurring Expenses

| Method | Endpoint                | Description                             |
| ------ | ----------------------- | --------------------------------------- |
| GET    | /recurring-expenses     | List all recurring expense templates    |
| POST   | /recurring-expenses     | Create a new recurring expense template |
| GET    | /recurring-expenses/:id | Get a single template                   |
| PUT    | /recurring-expenses/:id | Update a template                       |
| DELETE | /recurring-expenses/:id | Delete a template                       |

---

## Budgets

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| GET    | /budgets     | List all budgets    |
| POST   | /budgets     | Create a new budget |
| GET    | /budgets/:id | Get budget details  |
| PUT    | /budgets/:id | Update a budget     |
| DELETE | /budgets/:id | Delete a budget     |

---

## Reminders

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| GET    | /reminders     | List all reminders    |
| POST   | /reminders     | Create a new reminder |
| GET    | /reminders/:id | Get a single reminder |
| PUT    | /reminders/:id | Update a reminder     |
| DELETE | /reminders/:id | Delete a reminder     |

---

## Categories

| Method | Endpoint        | Description                               |
| ------ | --------------- | ----------------------------------------- |
| GET    | /categories     | List all categories                       |
| POST   | /categories     | Create a new category                     |
| PUT    | /categories/:id | Update a category                         |
| DELETE | /categories/:id | Delete a category (if no linked expenses) |

---

## Sessions

| Method | Endpoint      | Description                           |
| ------ | ------------- | ------------------------------------- |
| GET    | /sessions     | List all active sessions for the user |
| DELETE | /sessions/:id | Revoke a specific session             |
| DELETE | /sessions     | Revoke all sessions                   |

---

## Currency / Exchange Rates

| Method | Endpoint                      | Description                           |
| ------ | ----------------------------- | ------------------------------------- |
| GET    | /exchange-rates               | List latest exchange rates            |
| GET    | /exchange-rates/:base/:target | Get specific currency conversion rate |
| POST   | /exchange-rates/fetch         | Fetch latest rates from external API  |

---

### Notes

- All endpoints returning resources support **pagination** via query parameters `?page=` and `?limit=`  
- **Date/time fields** are in UTC; frontend converts to user’s local timezone  
- **Protected routes** return `401 Unauthorized` if JWT is missing or invalid  
- Input validation enforced using **Zod schemas** for all POST/PUT requests
