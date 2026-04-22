// ============================================
// POSTGRESQL WITH NODE.JS (pg library)
// ============================================
// Install: npm install pg dotenv

const { Pool } = require("pg");
require("dotenv").config();

// ---- 1. CONNECTION ----

// Using connection pool (recommended — reuses connections)
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "myapp",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
  max: 20,              // Max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Or use a connection string
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
// });

// Test connection
pool.on("connect", () => console.log("Connected to PostgreSQL"));
pool.on("error", (err) => console.error("Pool error:", err.message));

// ---- 2. BASIC QUERIES ----

async function basicQueries() {
  // Simple query
  const result = await pool.query("SELECT NOW() as current_time");
  console.log("Current time:", result.rows[0].current_time);

  // Query with parameters (parameterized — prevents SQL injection!)
  const userResult = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    ["alice@test.com"]
  );
  console.log("User:", userResult.rows[0]);

  // Multiple parameters
  const filtered = await pool.query(
    "SELECT * FROM users WHERE role = $1 AND is_active = $2 ORDER BY $3 LIMIT $4",
    ["admin", true, "created_at", 10]
  );

  // Result object
  console.log(result.rows);       // Array of row objects
  console.log(result.rowCount);   // Number of affected rows
  console.log(result.fields);     // Column metadata
}

// ---- 3. CRUD OPERATIONS ----

// CREATE
async function createUser(name, email, passwordHash) {
  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at
  `;
  const result = await pool.query(query, [name, email, passwordHash]);
  return result.rows[0];
}

// READ (single)
async function getUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
}

// READ (list with pagination)
async function getUsers({ page = 1, limit = 10, role, search }) {
  let query = "SELECT * FROM users WHERE 1=1";
  const params = [];
  let paramIndex = 1;

  if (role) {
    query += ` AND role = $${paramIndex++}`;
    params.push(role);
  }

  if (search) {
    query += ` AND (username ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  // Count total for pagination
  const countResult = await pool.query(
    query.replace("SELECT *", "SELECT COUNT(*)"),
    params
  );
  const total = parseInt(countResult.rows[0].count);

  // Add sorting and pagination
  query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  params.push(limit, (page - 1) * limit);

  const result = await pool.query(query, params);

  return {
    users: result.rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

// UPDATE
async function updateUser(id, updates) {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  const setClause = fields
    .map((field, i) => `${field} = $${i + 1}`)
    .join(", ");

  const query = `
    UPDATE users SET ${setClause}, updated_at = NOW()
    WHERE id = $${fields.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
}

// DELETE
async function deleteUser(id) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rowCount > 0;
}

// ---- 4. TRANSACTIONS ----

async function transferFunds(fromId, toId, amount) {
  const client = await pool.connect(); // Get dedicated connection

  try {
    await client.query("BEGIN");

    // Deduct from sender
    const deduct = await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1 RETURNING balance",
      [amount, fromId]
    );

    if (deduct.rowCount === 0) {
      throw new Error("Insufficient funds");
    }

    // Add to receiver
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toId]
    );

    // Record transaction
    await client.query(
      "INSERT INTO transactions (from_id, to_id, amount) VALUES ($1, $2, $3)",
      [fromId, toId, amount]
    );

    await client.query("COMMIT");
    console.log("Transfer successful!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Transfer failed:", err.message);
    throw err;
  } finally {
    client.release(); // Return connection to pool
  }
}

// ---- 5. QUERY BUILDER HELPER ----

// Simple query builder for dynamic queries
class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.conditions = [];
    this.params = [];
    this.orderClause = "";
    this.limitClause = "";
  }

  where(field, value, operator = "=") {
    this.params.push(value);
    this.conditions.push(`${field} ${operator} $${this.params.length}`);
    return this;
  }

  whereLike(field, value) {
    this.params.push(`%${value}%`);
    this.conditions.push(`${field} ILIKE $${this.params.length}`);
    return this;
  }

  orderBy(field, direction = "ASC") {
    this.orderClause = ` ORDER BY ${field} ${direction}`;
    return this;
  }

  limit(count, offset = 0) {
    this.params.push(count, offset);
    this.limitClause = ` LIMIT $${this.params.length - 1} OFFSET $${this.params.length}`;
    return this;
  }

  build() {
    let query = `SELECT * FROM ${this.table}`;
    if (this.conditions.length) {
      query += " WHERE " + this.conditions.join(" AND ");
    }
    query += this.orderClause + this.limitClause;
    return { text: query, values: this.params };
  }

  async execute() {
    const { text, values } = this.build();
    return pool.query(text, values);
  }
}

// Usage:
// const result = await new QueryBuilder('users')
//   .where('role', 'admin')
//   .whereLike('username', 'ali')
//   .orderBy('created_at', 'DESC')
//   .limit(10, 0)
//   .execute();

// ---- 6. MIGRATIONS (Manual) ----

async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const migrations = [
    {
      name: "001_create_users",
      sql: `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    },
    {
      name: "002_create_posts",
      sql: `CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT,
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    },
  ];

  for (const migration of migrations) {
    const exists = await pool.query(
      "SELECT 1 FROM migrations WHERE name = $1",
      [migration.name]
    );
    if (exists.rowCount === 0) {
      await pool.query(migration.sql);
      await pool.query("INSERT INTO migrations (name) VALUES ($1)", [migration.name]);
      console.log(`Migration ${migration.name} executed`);
    }
  }
}

// ---- 7. CLEANUP ----

async function cleanup() {
  await pool.end(); // Close all connections
  console.log("Pool closed");
}

// process.on('SIGINT', cleanup);
// process.on('SIGTERM', cleanup);

console.log("PostgreSQL with Node.js complete!");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Set up a PostgreSQL connection pool and test the connection
// 2. Create CRUD functions for a "products" table
// 3. Implement a paginated search with filters using parameterized queries
// 4. Write a transaction that creates a user and their first post atomically
// 5. Build a simple migration runner that tracks which migrations have been applied
// 6. NEVER use string concatenation for SQL queries — always use parameterized queries ($1, $2)
