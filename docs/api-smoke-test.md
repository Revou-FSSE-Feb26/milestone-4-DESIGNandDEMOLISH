# FinTrack API - Smoke Tests

This document provides example requests and responses for all endpoints in the FinTrack API. 
*Note: Replace `http://localhost:3000` with your live deployment URL when testing the production environment.*

---

## 1. Authentication (`/auth`)

### Register a New User (POST `/auth/register`)
**Request:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "securepassword123"
  }'
```
**Response (201 Created):**
```json
{
  "id": "e5b8d2a1-0987-4321-abcd-1234567890ab",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "USER",
  "createdAt": "2026-08-26T22:30:00.000Z"
}
```

### Login & Obtain JWT Token (POST `/auth/login`)
**Request:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "$2b$10$examplehashedpassword1111111111111111111111111111111"
  }'
```
**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. Users (`/users`)

### Create User (POST `/users`)
**Request:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mark Spencer",
    "email": "mark@example.com",
    "password": "password123"
  }'
```
**Response (201 Created):**
```json
{
  "id": "u-999-uuid",
  "name": "Mark Spencer",
  "email": "mark@example.com",
  "role": "USER",
  "createdAt": "2026-08-26T22:35:00.000Z"
}
```

### List Users (GET `/users`)
*Note: Passwords and hashes are excluded from all user API responses.*
**Request:**
```bash
curl -X GET http://localhost:3000/users
```
**Response (200 OK):**
```json
[
  {
    "id": "u-1-alice",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "USER",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### User Validation Error Example
**Request:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mark",
    "email": "invalid-email"
  }'
```
**Response (400 Bad Request):**
```json
{
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters",
    "password must be a string"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 3. Accounts (`/accounts`)

### Create Account (POST `/accounts`)
**Request:**
```bash
curl -X POST http://localhost:3000/accounts \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Travel Savings",
    "type": "bank",
    "balance": 1500.00
  }'
```
**Response (201 Created):**
```json
{
  "id": "acc-travel-123",
  "userId": "u-1-alice",
  "name": "Travel Savings",
  "type": "bank",
  "balance": "1500.00",
  "createdAt": "2026-08-26T22:40:00.000Z"
}
```

### List Accounts (GET `/accounts`)
**Request:**
```bash
curl -X GET http://localhost:3000/accounts \
  -H "Authorization: Bearer <TOKEN>"
```
**Response (200 OK):**
```json
[
  {
    "id": "acc-travel-123",
    "userId": "u-1-alice",
    "name": "Travel Savings",
    "type": "bank",
    "balance": "1500.00",
    "createdAt": "2026-08-26T22:40:00.000Z"
  }
]
```

### Get Account by ID (GET `/accounts/:id`)
**Request:**
```bash
curl -X GET http://localhost:3000/accounts/acc-travel-123 \
  -H "Authorization: Bearer <TOKEN>"
```
**Response (200 OK):**
```json
{
  "id": "acc-travel-123",
  "userId": "u-1-alice",
  "name": "Travel Savings",
  "type": "bank",
  "balance": "1500.00",
  "createdAt": "2026-08-26T22:40:00.000Z"
}
```

### Update Account (PATCH `/accounts/:id`)
**Request:**
```bash
curl -X PATCH http://localhost:3000/accounts/acc-travel-123 \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "World Tour Fund"
  }'
```
**Response (200 OK):**
```json
{
  "id": "acc-travel-123",
  "userId": "u-1-alice",
  "name": "World Tour Fund",
  "type": "bank",
  "balance": "1500.00",
  "createdAt": "2026-08-26T22:40:00.000Z"
}
```

### Delete Account (DELETE `/accounts/:id`)
**Request:**
```bash
curl -X DELETE http://localhost:3000/accounts/acc-travel-123 \
  -H "Authorization: Bearer <TOKEN>"
```
**Response (200 OK):**
```json
{
  "id": "acc-travel-123",
  "userId": "u-1-alice",
  "name": "World Tour Fund",
  "type": "bank",
  "balance": "1500.00"
}
```

### Account Validation Error Example
**Request:**
```bash
curl -X POST http://localhost:3000/accounts \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Crypto",
    "type": "crypto_wallet",
    "balance": -50.00
  }'
```
**Response (400 Bad Request):**
```json
{
  "message": [
    "type must be one of the following values: cash, bank, e_wallet",
    "balance must be a positive number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 4. Categories (`/categories`)

### Create Category (POST `/categories`)
**Request:**
```bash
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Freelance",
    "type": "income"
  }'
```
**Response (201 Created):**
```json
{
  "id": "cat-1",
  "name": "Freelance",
  "type": "income"
}
```

### List Categories (GET `/categories`)
**Request:**
```bash
curl -X GET http://localhost:3000/categories \
  -H "Authorization: Bearer <TOKEN>"
```
**Response (200 OK):**
```json
[
  {
    "id": "cat-1",
    "name": "Freelance",
    "type": "income"
  }
]
```

### Category Validation Error Example
**Request:**
```bash
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "type": "investment"
  }'
```
**Response (400 Bad Request):**
```json
{
  "message": [
    "name should not be empty",
    "type must be one of the following values: income, expense"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 5. Transactions (`/transactions`)

### Create Transaction (POST `/transactions`)
*Triggers automatic balance recalculation on the owning account.*
**Request:**
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": "acc-travel-123",
    "category_id": "cat-1",
    "type": "income",
    "amount": 500.00,
    "description": "Side gig payout",
    "transaction_date": "2026-08-26T00:00:00.000Z"
  }'
```
**Response (201 Created - Includes nested Category relation):**
```json
{
  "id": "tx-1",
  "accountId": "acc-travel-123",
  "categoryId": "cat-1",
  "type": "income",
  "amount": "500.00",
  "description": "Side gig payout",
  "transactionDate": "2026-08-26T00:00:00.000Z",
  "createdAt": "2026-08-26T22:45:00.000Z",
  "category": {
    "id": "cat-1",
    "name": "Freelance",
    "type": "income"
  }
}
```

### List User Transactions (GET `/transactions`)
*Returns relational query with nested `category` and `account` details.*
**Request:**
```bash
curl -X GET http://localhost:3000/transactions \
  -H "Authorization: Bearer <TOKEN>"
```
**Response (200 OK):**
```json
[
  {
    "id": "tx-1",
    "accountId": "acc-travel-123",
    "categoryId": "cat-1",
    "type": "income",
    "amount": "500.00",
    "description": "Side gig payout",
    "transactionDate": "2026-08-26T00:00:00.000Z",
    "createdAt": "2026-08-26T22:45:00.000Z",
    "category": {
      "id": "cat-1",
      "name": "Freelance",
      "type": "income"
    },
    "account": {
      "id": "acc-travel-123",
      "name": "World Tour Fund"
    }
  }
]
```

### Update Transaction (PATCH `/transactions/:id`)
*Recalculates account balance based on delta between old and new amount/type.*
**Request:**
```bash
curl -X PATCH http://localhost:3000/transactions/tx-1 \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 600.00
  }'
```
**Response (200 OK):**
```json
{
  "id": "tx-1",
  "accountId": "acc-travel-123",
  "type": "income",
  "amount": "600.00",
  "description": "Side gig payout"
}
```

### Delete Transaction (DELETE `/transactions/:id`)
*Restores account balance automatically.*
**Request:**
```bash
curl -X DELETE http://localhost:3000/transactions/tx-1 \
  -H "Authorization: Bearer <TOKEN>"
```
**Response (200 OK):**
```json
{
  "id": "tx-1",
  "accountId": "acc-travel-123",
  "amount": "600.00"
}
```

### Transaction Validation Error Example
**Request:**
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": "acc-1",
    "type": "invalid_type",
    "amount": -100,
    "transaction_date": "invalid-date"
  }'
```
**Response (400 Bad Request):**
```json
{
  "message": [
    "type must be one of the following values: income, expense, transfer",
    "amount must be a positive number",
    "transaction_date must be a valid ISO 8601 date string"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
