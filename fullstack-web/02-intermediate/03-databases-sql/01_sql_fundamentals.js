// ============================================
// SQL FUNDAMENTALS
// ============================================
// SQL (Structured Query Language) is used to manage relational databases.

// ---- 1. DATABASE BASICS ----
// Relational DB: data stored in tables with rows and columns
// Tables have schemas (structure) and relationships (foreign keys)

// ---- 2. DATA TYPES ----
const dataTypes = `
-- Common PostgreSQL Data Types
INTEGER / INT          -- Whole numbers
SERIAL                 -- Auto-incrementing integer (for IDs)
BIGINT                 -- Large integers
DECIMAL(10,2) / NUMERIC -- Exact decimal (for money)
REAL / FLOAT           -- Floating point
BOOLEAN                -- true/false
VARCHAR(255)           -- Variable-length string (max 255)
TEXT                   -- Unlimited length string
DATE                   -- Date only (2024-01-15)
TIMESTAMP              -- Date + time
TIMESTAMPTZ            -- Date + time + timezone (preferred)
UUID                   -- Universally unique identifier
JSON / JSONB           -- JSON data (JSONB is binary, faster queries)
`;

// ---- 3. CREATE TABLE ----
const createTable = `
-- Create a users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a posts table with foreign key
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a tags table and join table (many-to-many)
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Alter table
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users DROP COLUMN bio;
ALTER TABLE users ALTER COLUMN username TYPE VARCHAR(100);

-- Drop table
DROP TABLE IF EXISTS post_tags;
`;

// ---- 4. INSERT DATA ----
const insertData = `
-- Insert single row
INSERT INTO users (username, email, password_hash)
VALUES ('alice', 'alice@test.com', 'hashed_pw_123');

-- Insert multiple rows
INSERT INTO users (username, email, password_hash) VALUES
  ('bob', 'bob@test.com', 'hashed_pw_456'),
  ('charlie', 'charlie@test.com', 'hashed_pw_789');

-- Insert and return the created row
INSERT INTO posts (title, content, author_id)
VALUES ('First Post', 'Hello World!', 1)
RETURNING id, title, created_at;
`;

// ---- 5. SELECT (READ) DATA ----
const selectData = `
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT username, email FROM users;

-- With alias
SELECT username AS name, email AS contact FROM users;

-- WHERE clause (filtering)
SELECT * FROM users WHERE role = 'admin';
SELECT * FROM users WHERE is_active = true AND role = 'user';
SELECT * FROM users WHERE role = 'admin' OR role = 'moderator';
SELECT * FROM users WHERE role IN ('admin', 'moderator');
SELECT * FROM users WHERE username LIKE 'a%';     -- Starts with 'a'
SELECT * FROM users WHERE username ILIKE '%alice%'; -- Case-insensitive
SELECT * FROM users WHERE email IS NOT NULL;
SELECT * FROM users WHERE created_at > '2024-01-01';
SELECT * FROM users WHERE id BETWEEN 1 AND 10;

-- Sorting
SELECT * FROM users ORDER BY created_at DESC;
SELECT * FROM users ORDER BY role ASC, username ASC;

-- Pagination
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 20;  -- Page 3, 10 per page

-- Distinct
SELECT DISTINCT role FROM users;

-- Count and aggregates
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM users WHERE is_active = true;
SELECT role, COUNT(*) as count FROM users GROUP BY role;
SELECT role, COUNT(*) as count FROM users GROUP BY role HAVING COUNT(*) > 5;

-- Aggregate functions
SELECT AVG(price) FROM products;
SELECT SUM(quantity) FROM order_items WHERE order_id = 1;
SELECT MIN(price), MAX(price) FROM products;
`;

// ---- 6. UPDATE DATA ----
const updateData = `
-- Update specific rows
UPDATE users SET role = 'admin' WHERE username = 'alice';

-- Update multiple columns
UPDATE users SET email = 'newemail@test.com', updated_at = NOW()
WHERE id = 1;

-- Update with RETURNING
UPDATE users SET is_active = false WHERE id = 5
RETURNING id, username, is_active;

-- Conditional update
UPDATE products SET price = price * 0.9  -- 10% discount
WHERE category = 'electronics' AND price > 100;
`;

// ---- 7. DELETE DATA ----
const deleteData = `
-- Delete specific rows
DELETE FROM users WHERE id = 5;

-- Delete with condition
DELETE FROM posts WHERE published = false AND created_at < '2024-01-01';

-- Delete all rows (keeps table structure)
DELETE FROM logs;

-- TRUNCATE (faster for deleting all rows, resets serial)
TRUNCATE TABLE logs RESTART IDENTITY;
`;

// ---- 8. JOINS ----
const joins = `
-- INNER JOIN — only matching rows from both tables
SELECT users.username, posts.title
FROM users
INNER JOIN posts ON users.id = posts.author_id;

-- LEFT JOIN — all rows from left table + matching from right
SELECT users.username, COUNT(posts.id) as post_count
FROM users
LEFT JOIN posts ON users.id = posts.author_id
GROUP BY users.username;

-- RIGHT JOIN — all rows from right + matching from left
SELECT users.username, posts.title
FROM users
RIGHT JOIN posts ON users.id = posts.author_id;

-- Many-to-many join (through junction table)
SELECT posts.title, tags.name as tag
FROM posts
JOIN post_tags ON posts.id = post_tags.post_id
JOIN tags ON post_tags.tag_id = tags.id;

-- Self join
SELECT e.name as employee, m.name as manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- Subquery
SELECT username FROM users
WHERE id IN (SELECT author_id FROM posts WHERE published = true);
`;

// ---- 9. INDEXES ----
const indexes = `
-- Create index (speeds up queries on that column)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_author ON posts(author_id);

-- Unique index
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Composite index
CREATE INDEX idx_posts_author_date ON posts(author_id, created_at);

-- Remove index
DROP INDEX idx_users_email;

-- When to index:
-- ✓ Columns used in WHERE, JOIN, ORDER BY frequently
-- ✓ Foreign key columns
-- ✗ Columns rarely queried
-- ✗ Tables with very few rows
-- ✗ Columns with very low cardinality (e.g., boolean)
`;

console.log("SQL Fundamentals complete!");
console.log("Key: SELECT, INSERT, UPDATE, DELETE, JOIN, WHERE, GROUP BY");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Design a schema for a blog: users, posts, comments, categories (with relationships)
// 2. Write queries to: find all posts by a user, count posts per category, find most commented posts
// 3. Write an UPDATE that increases the price of all products in a category by 15%
// 4. Write a JOIN query to get users with their post count, including users with 0 posts
// 5. Create appropriate indexes for a users table queried by email and role
// 6. Write a query with GROUP BY and HAVING to find categories with more than 10 products
