// ============================================
// DATABASE OPTIMIZATION & SCALING
// ============================================
// Indexing, query optimization, scaling patterns

// ---- 1. INDEXING ----

const indexing = `
-- ===== WHY INDEXES? =====
-- Without index: full table scan O(n)
-- With index: B-tree lookup O(log n)

-- ===== Basic Index =====
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_created ON posts(created_at);

-- ===== Unique Index =====
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- ===== Composite Index =====
-- Order matters! (leftmost prefix rule)
CREATE INDEX idx_posts_author_date ON posts(author_id, created_at DESC);
-- This index helps:
--   WHERE author_id = 5
--   WHERE author_id = 5 AND created_at > '2024-01-01'
-- This index does NOT help:
--   WHERE created_at > '2024-01-01'  (skips first column)

-- ===== Partial Index =====
CREATE INDEX idx_active_users ON users(email) WHERE active = true;
-- Smaller index, only includes active users

-- ===== Covering Index (includes) =====
CREATE INDEX idx_posts_covering ON posts(author_id)
  INCLUDE (title, created_at);
-- Query can be answered from index alone (no table lookup)

-- ===== When to Index =====
-- ✅ Columns in WHERE clauses
-- ✅ Columns in JOIN conditions
-- ✅ Columns in ORDER BY
-- ✅ Foreign keys
-- ❌ Small tables (< 1000 rows)
-- ❌ Columns with low cardinality (boolean, status)
-- ❌ Columns that change frequently (many writes)
`;

// ---- 2. QUERY OPTIMIZATION ----

const queryOptimization = `
-- ===== EXPLAIN ANALYZE =====
EXPLAIN ANALYZE SELECT * FROM posts
WHERE author_id = 5
ORDER BY created_at DESC
LIMIT 20;

-- Output shows:
-- Seq Scan (bad) vs Index Scan (good)
-- Actual time and rows
-- Sort method (in-memory vs disk)

-- ===== Common Optimizations =====

-- 1. Use specific columns instead of SELECT *
-- ❌
SELECT * FROM users;
-- ✅
SELECT id, name, email FROM users;

-- 2. Limit results
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20;

-- 3. Use EXISTS instead of COUNT for existence checks
-- ❌
SELECT COUNT(*) FROM orders WHERE user_id = 5;  -- counts ALL
-- ✅
SELECT EXISTS(SELECT 1 FROM orders WHERE user_id = 5);  -- stops at first

-- 4. Avoid functions on indexed columns
-- ❌ (can't use index)
SELECT * FROM users WHERE LOWER(email) = 'alice@test.com';
-- ✅ (use expression index)
CREATE INDEX idx_lower_email ON users(LOWER(email));

-- 5. Use UNION ALL instead of UNION (no dedup overhead)
SELECT id FROM active_users
UNION ALL
SELECT id FROM inactive_users;

-- 6. Batch operations
-- ❌ One by one
INSERT INTO logs VALUES (1, 'a');
INSERT INTO logs VALUES (2, 'b');
-- ✅ Batch
INSERT INTO logs VALUES (1, 'a'), (2, 'b'), (3, 'c');
`;

// ---- 3. PRISMA OPTIMIZATION ----

const prismaOptimization = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'warn', 'error'],  // log slow queries
});

// ===== Select Only Needed Fields =====
// ❌ Fetches all columns
const users = await prisma.user.findMany();

// ✅ Only fetch what you need
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true },
});

// ===== Prevent N+1 with include =====
// ❌ N+1 problem
const users = await prisma.user.findMany();
for (const user of users) {
  user.posts = await prisma.post.findMany({
    where: { authorId: user.id },
  });
}

// ✅ Eager loading (single query with JOIN)
const users = await prisma.user.findMany({
  include: {
    posts: {
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true },
    },
  },
});

// ===== Cursor-Based Pagination =====
// Better than offset for large datasets
async function getPosts(cursor, limit = 20) {
  const posts = await prisma.post.findMany({
    take: limit + 1,  // fetch one extra to check hasMore
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: { createdAt: 'desc' },
  });

  const hasMore = posts.length > limit;
  const data = hasMore ? posts.slice(0, -1) : posts;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return { data, hasMore, nextCursor };
}

// ===== Batch Operations =====
// Create many
await prisma.user.createMany({
  data: [
    { name: 'Alice', email: 'alice@test.com' },
    { name: 'Bob', email: 'bob@test.com' },
  ],
  skipDuplicates: true,
});

// Update many
await prisma.post.updateMany({
  where: { published: false, createdAt: { lt: thirtyDaysAgo } },
  data: { status: 'archived' },
});

// Transaction
await prisma.$transaction([
  prisma.account.update({ where: { id: fromId }, data: { balance: { decrement: amount } } }),
  prisma.account.update({ where: { id: toId }, data: { balance: { increment: amount } } }),
]);

// ===== Raw Queries (when ORM is too slow) =====
const result = await prisma.$queryRaw\`
  SELECT u.name, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON u.id = p.author_id
  WHERE u.active = true
  GROUP BY u.id
  HAVING COUNT(p.id) > 5
  ORDER BY post_count DESC
  LIMIT 10
\`;
`;

// ---- 4. MONGOOSE OPTIMIZATION ----

const mongooseOptimization = `
const mongoose = require('mongoose');

// ===== Lean Queries (skip Mongoose overhead) =====
// Normal: returns Mongoose documents (heavy)
const users = await User.find({ active: true });

// Lean: returns plain JS objects (faster, less memory)
const users = await User.find({ active: true }).lean();

// ===== Select Fields =====
const users = await User.find()
  .select('name email -_id')  // include name, email; exclude _id
  .lean();

// ===== Indexes =====
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  name: { type: String, index: true },
  createdAt: { type: Date, default: Date.now },
});

// Compound index
userSchema.index({ name: 1, createdAt: -1 });

// Text index (for search)
userSchema.index({ name: 'text', bio: 'text' });

// ===== Aggregation Pipeline =====
const topAuthors = await Post.aggregate([
  { $match: { published: true } },
  { $group: {
    _id: '$authorId',
    postCount: { $sum: 1 },
    avgLikes: { $avg: '$likes' },
  }},
  { $sort: { postCount: -1 } },
  { $limit: 10 },
  { $lookup: {
    from: 'users',
    localField: '_id',
    foreignField: '_id',
    as: 'author',
  }},
  { $unwind: '$author' },
  { $project: {
    authorName: '$author.name',
    postCount: 1,
    avgLikes: { $round: ['$avgLikes', 1] },
  }},
]);

// ===== Bulk Operations =====
await User.bulkWrite([
  { insertOne: { document: { name: 'Alice', email: 'alice@test.com' } } },
  { updateOne: { filter: { email: 'bob@test.com' }, update: { $set: { active: false } } } },
  { deleteOne: { filter: { email: 'old@test.com' } } },
]);
`;

// ---- 5. SCALING PATTERNS ----

const scalingPatterns = `
  // ===== Vertical Scaling =====
  // Bigger server (more CPU, RAM)
  // Simple but limited

  // ===== Horizontal Scaling =====
  // More servers behind a load balancer
  // Requires stateless app design

  // ===== Read Replicas =====
  // Primary DB: writes
  // Replica DBs: reads (1-2 second lag)
  // Great for read-heavy apps (80% reads)

  // ===== Database Sharding =====
  // Split data across multiple databases
  // Shard by user_id, region, etc.
  // Complex but handles massive scale

  // ===== Caching Strategy =====
  // Cache-Aside: app manages cache + DB
  // Write-Through: write to cache + DB simultaneously
  // Write-Behind: write to cache, async write to DB

  // ===== Connection Pooling =====
  // Reuse DB connections instead of creating new ones
  // Prisma: default pool size = num_cpus * 2 + 1
  // pg: const pool = new Pool({ max: 20 });
`;

// ---- 6. MIGRATION STRATEGIES ----

const migrations = `
// ===== Prisma Migrations =====
// Create migration
npx prisma migrate dev --name add_user_role

// Apply in production
npx prisma migrate deploy

// Reset database (development only!)
npx prisma migrate reset

// ===== Zero-Downtime Migrations =====
// 1. Add new column (nullable or with default)
// 2. Deploy code that writes to both old + new column
// 3. Backfill old data
// 4. Deploy code that reads from new column
// 5. Remove old column

// ===== Example: Rename column safely =====
// Step 1: Add new column
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
// Step 2: Backfill
UPDATE users SET full_name = name;
// Step 3: App reads from full_name
// Step 4: Drop old column
ALTER TABLE users DROP COLUMN name;
`;

console.log("=== Database Optimization Summary ===");
console.log(`
  Indexing:
    B-tree for equality/range queries
    Composite indexes (leftmost prefix rule)
    Covering indexes (avoid table lookups)
    Partial indexes (subset of rows)

  Query Optimization:
    EXPLAIN ANALYZE to find slow queries
    Select specific columns, not *
    Use EXISTS over COUNT for checks
    Batch operations over loops

  ORM Tips:
    Prisma: select, include, lean-like queries
    Mongoose: .lean(), proper indexes
    Cursor pagination for large datasets

  Scaling:
    Caching (Redis) → Read replicas → Sharding
    Connection pooling for all DB operations
`);
