# FinTrack API - Smoke Tests

This document provides example requests and expected responses for all endpoints in the FinTrack API. 
*Note: Replace `http://localhost:3000` with the live deployment URL when testing the production environment.*

---

## 1. Users

### Create a User (POST `/users`)
**Request:**

    curl -X POST http://localhost:3000/users \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "password": "securepassword123"
    }'

**Respone:**

    {
        "id": 3,
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "password": "securepassword123",
        "role": "user",
        "created_at": "2026-08-22T01:59:56.000Z"
    }


### List Users (GET /users)
**Request:**

        curl -X GET http://localhost:3000/users


**Response:**

    [
        {
            "id": 1,
            "name": "Alice Johnson",
            "email": "alice@example.com",
            "password": "hashed_pass_1",
            "role": "user",
            "created_at": "2026-01-01T00:00:00.000Z"
        }
    ]


## 2. Categories
### Create a Category (POST /categories)
**Request:**

    curl -X POST http://localhost:3000/categories \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Freelance",
      "type": "income"
    }'

**Response:**
    
    {
      "id": 3,
      "name": "Freelance",
      "type": "income"
    }

### List Categories (GET /categories)
**Request:**

    curl -X GET http://localhost:3000/categories

**Response:**

    [
        {
            "id": 1,
            "name": "Salary",
            "type": "income"
        }
    ]
