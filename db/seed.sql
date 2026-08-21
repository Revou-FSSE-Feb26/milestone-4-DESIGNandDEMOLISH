-- db/seed.sql

-- Clear old records
TRUNCATE TABLE transactions, categories, accounts, users RESTART IDENTITY CASCADE;

-- Users (3)
INSERT INTO users (name, email, password, role) VALUES
('Alice Johnson', 'alice@example.com', 'hashed_pass_1', 'user'),
('Bob Smith', 'bob@example.com', 'hashed_pass_2', 'user'),
('Charlie Brown', 'charlie@example.com', 'hashed_pass_3', 'admin');

-- Accounts (2 per user = 6 total)
INSERT INTO accounts (user_id, name, type, balance) VALUES
(1, 'Alice Main Checking', 'bank', 2500.00),
(1, 'Alice Pocket Cash', 'cash', 150.00),
(2, 'Bob Savings', 'bank', 5000.00),
(2, 'Bob Pay Wallet', 'e-wallet', 320.50),
(3, 'Charlie Vault', 'bank', 12000.00),
(3, 'Charlie Daily Cash', 'cash', 80.00);

-- Categories (7 categories: income, expense, and 1 unused expense category for testing)
INSERT INTO categories (name, type) VALUES
('Salary', 'income'),
('Freelance', 'income'),
('Groceries', 'expense'),
('Utilities', 'expense'),
('Entertainment', 'expense'),
('Dining Out', 'expense'),
('Subscriptions', 'expense'); -- Kept unused for zero-transaction test

-- Transactions (21 entries)
INSERT INTO transactions (account_id, category_id, type, amount, description, transaction_date) VALUES
(1, 1, 'income', 3000.00, 'Monthly Salary', '2026-01-01'),
(1, 3, 'expense', 150.00, 'Weekly Grocery Supermarket', '2026-01-03'),
(1, 4, 'expense', 120.00, 'Electricity Bill', '2026-01-05'),
(1, 5, 'expense', 45.00, 'Movie Tickets', '2026-01-10'),
(2, 6, 'expense', 25.00, 'Coffee and Snacks', '2026-01-12'),
(2, 3, 'expense', 30.00, 'Corner Store Supplies', '2026-01-15'),

(3, 1, 'income', 4500.00, 'Monthly Salary', '2026-01-01'),
(3, 2, 'income', 800.00, 'Side Project Payment', '2026-01-14'),
(3, 3, 'expense', 220.00, 'Bulk Grocery Shopping', '2026-01-16'),
(3, 4, 'expense', 200.00, 'Internet and Phone', '2026-01-18'),
(4, 6, 'expense', 60.00, 'Dinner with Friends', '2026-01-20'),
(4, 5, 'expense', 15.00, 'Gaming Subscription', '2026-01-22'),

(5, 1, 'income', 6000.00, 'Executive Salary', '2026-01-01'),
(5, 3, 'expense', 400.00, 'Organic Market Shopping', '2026-01-02'),
(5, 4, 'expense', 350.00, 'Water & Power Utilities', '2026-01-08'),
(5, 6, 'expense', 180.00, 'Fine Dining', '2026-01-15'),
(6, 6, 'expense', 12.00, 'Lunch Grab', '2026-01-17'),

(1, 3, 'expense', 110.00, 'Mid-month Groceries', '2026-02-02'),
(1, 4, 'expense', 125.00, 'Water Bill', '2026-02-05'),
(3, 3, 'expense', 205.00, 'February Groceries', '2026-02-04'),
(4, 6, 'expense', 40.00, 'Takeout Lunch', '2026-02-10');
