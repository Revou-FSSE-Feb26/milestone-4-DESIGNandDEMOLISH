# FinTrack API 🪙

FinTrack API is a robust, production-ready backend application built with NestJS, TypeScript, PostgreSQL, and Prisma ORM. It enables users to manage personal financial accounts (cash, bank accounts, e-wallets), track income and expense transactions, organize categories, and maintain accurate financial balances with security features including JWT authentication, RBAC, rate limiting, and global request logging.

---

## 📐 Entity-Relationship Diagram (ERD)

![FinTrack ERD](docs/erd.png)

### Schema Highlights:
- **`users`**: Manages user credentials, role-based access (`user` / `admin`), and timestamps. Passwords are password-hashed using bcrypt and never returned in API responses.
- **`accounts`**: Stores account types (`cash`, `bank`, `e-wallet`), balances using exact precision (`NUMERIC(12, 2)` / `@db.Decimal(12, 2)`), and foreign key link to `users`.
- **`categories`**: Classifies entries into `income` or `expense`.
- **`transactions`**: Links accounts and categories with precise amounts, transaction dates, and types (`income`, `expense`, `transfer`).

---

## 🚀 Setup & Local Execution Instructions

### Prerequisites
- **Node.js**: v18+
- **npm**: v9+
- **PostgreSQL**: Local instance or hosted instance (Supabase / Neon / Railway)

### 1. Environment Configuration
Copy `.env.example` to `.env` and fill in your database connection string and secret key:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fintrack_db?schema=public"
JWT_SECRET="fintrack-super-secret-key"
FRONTEND_URL="http://localhost:3000"
```

### 2. Database Migration & Seeding (Prisma)
Run Prisma migrations to create tables and execute the TypeScript seed script:
```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Seed realistic initial data (3 users, 6 accounts, 7 categories, 21 transactions)
npx prisma db seed
```

### 3. Running SQL Files Directly (Alternative / Grading Verification)
If testing raw PostgreSQL DDL & DML scripts from Week 19:
```bash
# Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE fintrack_db;"

# Execute DDL schema, seed data, and analytical queries in order
psql -U postgres -d fintrack_db -f db/schema.sql
psql -U postgres -d fintrack_db -f db/seed.sql
psql -U postgres -d fintrack_db -f db/queries.sql
```

### 4. Install Dependencies & Start API Server
```bash
npm install
npm run start:dev
```
The API server will listen on `http://localhost:3000`.

---

## 🏗️ Architecture & Technical Design

### Custom Provider & Testability (`BalanceCalculatorProvider`)
Balance calculation for transactions is decoupled from service business logic into a custom provider: `BalanceCalculatorService` (registered via `BALANCE_CALCULATOR_TOKEN`). 

> **Why this design?**
> Factoring out balance calculation into a dedicated custom provider adheres to the Single Responsibility Principle and simplifies unit testing. The provider can be independently tested with isolated pure arithmetic inputs or easily mocked during `TransactionsService` unit testing without instantiating database transactions or complex service mocks.

### Authentication & Authorization Flow
- **Password Security**: Hashes passwords with `bcrypt` (10 salt rounds) on user registration. Excludes password hashes from all User entity responses.
- **JWT & Passport**: Upon successful login (`POST /auth/login`), a signed JWT payload (`userId`, `email`, `role`) is issued. Protected routes enforce authentication via `JwtAuthGuard`.
- **Per-User Ownership Enforcement**: Authenticated requests on `/accounts` and `/transactions` inspect `req.user.userId`. Users are strictly isolated and can only read, create, update, or delete accounts and transactions that belong to them.
- **Role-Based Access Control (RBAC)**: Enforced via `RolesGuard` and `@Roles('admin')`. For example, deleting categories (`DELETE /categories/:id`) is restricted exclusively to administrator accounts.

### Security & Middleware Hardening
- **Global Request Logging**: `LoggerMiddleware` is registered globally in `AppModule` using `configure(consumer)`. It logs HTTP method, endpoint path, status code, and execution time (ms) for every incoming request.
- **Rate Limiting**: `ThrottlerModule` and `ThrottlerGuard` protect against brute-force attacks (rate limiting `/auth/login` to 5 requests per minute).
- **HTTP Security Headers**: `helmet()` middleware is initialized in `main.ts` to attach standard HTTP security headers.
- **Validation**: Global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true` rejects unexpected fields and formats payloads against DTO rules.

---

## 📄 API Documentation & Postman Collection

- **Smoke Test Documentation**: Detailed curl commands, request bodies, and success/error responses can be found in [`docs/api-smoke-test.md`](file:///Users/alexander/Documents/Programing/revouFeb/BACKEND/assigmnet/milestone-4-DESIGNandDEMOLISH/docs/api-smoke-test.md).
- **Postman Collection**: A complete Postman collection is exported to [`docs/fintrack.postman_collection.json`](file:///Users/alexander/Documents/Programing/revouFeb/BACKEND/assigmnet/milestone-4-DESIGNandDEMOLISH/docs/fintrack.postman_collection.json). It includes:
  - Auth flow (Login script automatically stores token into `{{token}}` collection variable).
  - Success and validation error examples for all endpoints across Users, Accounts, Categories, and Transactions.
  - 403 Forbidden example for non-admin users attempting admin-only operations.

---

## 📌 Known Limitations & Future Enhancements

- **Transfer Transactions**: Future updates will add explicit cross-account transfer transactions that atomically update both origin and destination account balances.
- **Pagination & Analytics**: Future releases will add page-based pagination for transactions and aggregated summary endpoints (e.g. monthly category spending reports).
