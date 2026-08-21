-- db/queries.sql

-- 1. Filtered SELECT: Get all expense transactions for Account ID 1 ordered by transaction date descending
SELECT * FROM transactions 
WHERE account_id = 1 AND type = 'expense' 
ORDER BY transaction_date DESC;

-- 2. 3-Table JOIN: Display transaction history showing user name, account name, category name, and amount
SELECT 
    u.name AS user_name,
    a.name AS account_name,
    c.name AS category_name,
    t.type,
    t.amount,
    t.transaction_date
FROM transactions t
JOIN accounts a ON t.account_id = a.id
JOIN users u ON a.user_id = u.id
LEFT JOIN categories c ON t.category_id = c.id;

-- 3. GROUP BY Aggregation: Calculate total expenses grouped by category name and month
SELECT 
    c.name AS category_name,
    TO_CHAR(t.transaction_date, 'YYYY-MM') AS month,
    SUM(t.amount) AS total_expense
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY c.name, TO_CHAR(t.transaction_date, 'YYYY-MM')
ORDER BY month ASC, total_expense DESC;

-- 4. Advanced Query (Subquery/CTE): Find accounts whose balance is lower than the average balance of that specific user
WITH user_averages AS (
    SELECT user_id, AVG(balance) AS avg_balance
    FROM accounts
    GROUP BY user_id
)
SELECT a.id, a.user_id, a.name, a.balance, ua.avg_balance
FROM accounts a
JOIN user_averages ua ON a.user_id = ua.user_id
WHERE a.balance < ua.avg_balance;

-- 5. LEFT JOIN: Identify categories that currently have zero transactions associated with them
SELECT c.id, c.name, c.type
FROM categories c
LEFT JOIN transactions t ON c.id = t.category_id
WHERE t.id IS NULL;

-- 6. Advanced Query (Window Function): Rank spending categories by total expense amount for each user
WITH user_category_expenses AS (
    SELECT 
        u.id AS user_id,
        u.name AS user_name,
        c.name AS category_name,
        SUM(t.amount) AS total_spent,
        DENSE_RANK() OVER (PARTITION BY u.id ORDER BY SUM(t.amount) DESC) AS rank
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    JOIN users u ON a.user_id = u.id
    JOIN categories c ON t.category_id = c.id
    WHERE t.type = 'expense'
    GROUP BY u.id, u.name, c.name
)
SELECT user_name, category_name, total_spent
FROM user_category_expenses
WHERE rank = 1;

-- 7. Aggregation with HAVING: Show accounts that have accumulated total income exceeding $1,000
SELECT a.id, a.name, SUM(t.amount) AS total_income
FROM accounts a
JOIN transactions t ON a.id = t.account_id
WHERE t.type = 'income'
GROUP BY a.id, a.name
HAVING SUM(t.amount) > 1000;

-- 8. Filtered Join: Get all transactions belonging to 'e-wallet' type accounts
SELECT t.id, a.name AS account_name, a.type AS account_type, t.amount, t.description
FROM transactions t
JOIN accounts a ON t.account_id = a.id
WHERE a.type = 'e-wallet';
