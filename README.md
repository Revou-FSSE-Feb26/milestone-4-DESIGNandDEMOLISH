# FinTrack API 🪙

FinTrack API is a backend application designed to power personal finance tracking software. It allows users to manage financial accounts (bank accounts, cash, e-wallets), track incoming and outgoing financial transactions, and classify spending into income and expense categories to provide insights into individual financial habits.

---

## Entity-Relationship Diagram (ERD)

![FinTrack ERD](docs/erd.png)

---

## Getting Started (NestJS API)

### Prerequisites
* Node.js (v18+)
* npm

### Installation & Run
1. Install dependencies:
     ```bash
     npm install

2.	Start the NestJS development server:
     ```bash
      npm run start:dev

3.	Test GET endpoints on local host:
⚬	http://localhost:3000/users
⚬	http://localhost:3000/accounts
⚬	http://localhost:3000/categories
⚬	http://localhost:3000/transactions

### PostgreSQL Database Setup
Running SQL Scripts Locally
1.	Connect to local PostgreSQL instance:
    ```bash
    psql -U postgres
2.	Create database:
    ```bash
    CREATE DATABASE fintrack_db;
    \c fintrack_db
3.	Execute database scripts in order:
    ```bash
    psql -U postgres -d fintrack_db -f db/schema.sql
    psql -U postgres -d fintrack_db -f db/seed.sql
    psql -U postgres -d fintrack_db -f db/queries.sql


---

## Final Submission Verification

Before pushing to GitHub, verify that:
* [x] Schema table/column names strictly match specification requirements (`users`, `accounts`, `categories`, `transactions`).
* [x] Amounts use `NUMERIC(12, 2)` format.
* [x] Primary and foreign key integrity constraints are declared correctly.
* [x] `queries.sql` contains 8 queries covering filtering, 3-table JOINs, GROUP BY aggregations, window functions/CTEs, and zero-transaction LEFT JOINs.
* [x] GET endpoints return schemas aligned with model expectations.

Do you have any questions about configuring the PostgreSQL environment or adding additional features to this base structure?

