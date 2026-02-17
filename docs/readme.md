# Expense & Vacation Budget Tracker

## Overview

A cross-platform application to track personal expenses, manage monthly budgets, and plan spending for vacations or events. The app supports multi-currency transactions, recurring expenses, reminders, and dashboards for financial insights. Mobile-first experience is provided through **React Native + Expo**, with a responsive web app using **React Native Web**.

---

## Tech Stack

- **Frontend**
  - React Native (Expo)
  - React Native Web
  - NativeWind (Tailwind for React Native)
  - shadcn/ui (Web)
  - TypeScript
- **Backend**
  - Node.js
  - Express
  - TypeScript
  - Zod (validation)
- **Database**
  - PostgreSQL
  - ExchangeRate caching
- **Auth**
  - JWT + Refresh Tokens
  - Multi-device sessions
- **Infrastructure**
  - Docker & Docker Compose
  - Cloud-ready for AWS/GCP
  - Cron workers for recurring expenses
- **CI/CD**
  - GitHub Actions
  - Linting, type-checks, test runners

---

## Features

- User authentication with multi-device support and refresh tokens
- Expense tracking with categories and notes
- Multi-currency support with exchange rate normalization
- Budget tracking: monthly, vacation, and event budgets
- Recurring expenses with automated generation
- Reminders and calendar view
- Dashboards for financial overview

---

## Project Structure (Monorepo)
expense-tracker/
│
├─ apps/
│   ├─ mobile/          # React Native Expo app
│   └─ web/             # React Native Web app
│
├─ services/
│   └─ api/             # Node + Express backend
│
├─ packages/
│   ├─ ui/              # Shared UI components
│   ├─ types/           # Shared TypeScript types
│   └─ currency/        # Currency / exchange rate utils
│
├─ docker/              # Dockerfile and Compose
│
└─ docs/                # Documentation: PRD, architecture, domain models

---

# Monorepo Workflow & Getting Started

This project uses a **monorepo architecture** to manage mobile, web, and backend code in a single repository. Each app/service has its own `package.json` and can be run independently or together.

---

## Folder Structure

- `apps/mobile` — React Native mobile app (Expo)  
- `apps/web` — React Native Web app (Expo Web)  
- `services/api` — Node + Express backend API  
- `packages/ui` — Shared UI components  
- `packages/types` — Shared TypeScript types  
- `docker/` — Docker and Docker Compose configurations  
- `docs/` — Documentation

---

## Installing Dependencies

### Mobile App

```
cd apps/mobile
npm install
```

### Web App

```
cd apps/web
npm install
```

### Backend API

```
cd services/api
npm install
```

---

## Configure Environment Variables

- Copy `.env.example` to `.env` in both `apps` and `services/api` if needed.
- Add the following values:
  - Database credentials
  - JWT secrets
  - Exchange rate API keys
  - Any other required keys

---

## Start Docker Containers

```
docker compose up
```

- Starts PostgreSQL and any other services defined in `docker/docker-compose.yml`.

---

## Run Migrations

```
cd services/api
npm run migrate
```

- Applies all database migrations for the backend.

---

## Start Development Servers

You can start each app individually:

- **Mobile App**:  
  ```
  cd apps/mobile
  npm run start
  ```
  Opens Expo DevTools for mobile.

- **Web App**:  
  ```
  cd apps/web
  npm run start
  ```
  Runs the web version via Expo Web.

- **Backend API**:  
  ```
  cd services/api
  npm run dev
  ```
  Starts the Express API connected to Postgres.

---

## Optional: Start Everything at Once

Install `concurrently` in the root:

```
npm install --save-dev concurrently
```

Add root-level scripts in `package.json`:

```json
{
  "scripts": {
    "dev:mobile": "npm run start --workspace=apps/mobile",
    "dev:web": "npm run start --workspace=apps/web",
    "dev:api": "npm run dev --workspace=services/api",
    "dev:all": "concurrently \"npm run dev:mobile\" \"npm run dev:web\" \"npm run dev:api\""
  }
}
```

Now you can start all apps from the root:

```
npm run dev:all
```

- Mobile, web, and backend servers start simultaneously.
- Makes development much faster without switching directories constantly.

---

## Notes

- Ensure Docker is running before starting any service.
- Mobile app (Expo) can be previewed on device or simulator.
- Backend API runs at `http://localhost:3000` by default.
- Web app runs at `http://localhost:19006` (Expo Web) or similar.
