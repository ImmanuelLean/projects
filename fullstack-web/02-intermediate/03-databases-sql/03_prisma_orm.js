// ============================================
// PRISMA ORM
// ============================================
// Prisma is a modern ORM for Node.js and TypeScript.
// Install: npm install prisma @prisma/client
// Init:    npx prisma init

// ---- 1. SCHEMA (prisma/schema.prisma) ----

const prismaSchema = `
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Models define your database tables

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  password  String
  role      Role     @default(USER)
  isActive  Boolean  @default(true) @map("is_active")
  bio       String?                // ? = optional/nullable
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  posts     Post[]
  comments  Comment[]
  profile   Profile?              // One-to-one

  @@map("users")                  // Table name in database
  @@index([email])                // Index
}

enum Role {
  USER
  ADMIN
  MODERATOR
}

model Profile {
  id        Int    @id @default(autoincrement())
  avatar    String?
  website   String?
  userId    Int    @unique @map("user_id")
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String?
  published Boolean   @default(false)
  authorId  Int       @map("author_id")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  // Relations
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments  Comment[]
  tags      Tag[]     // Many-to-many (Prisma handles join table)

  @@map("posts")
  @@index([authorId])
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  postId    Int      @map("post_id")
  authorId  Int      @map("author_id")
  createdAt DateTime @default(now()) @map("created_at")

  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("comments")
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]

  @@map("tags")
}
`;

// ---- 2. CLI COMMANDS ----

const commands = `
# Initialize Prisma
npx prisma init

# Create/apply migrations
npx prisma migrate dev --name init          # Dev: create + apply migration
npx prisma migrate deploy                    # Production: apply pending migrations

# Generate Prisma Client (after schema changes)
npx prisma generate

# Open Prisma Studio (GUI for database)
npx prisma studio

# Reset database (drops all data!)
npx prisma migrate reset

# Introspect existing database → generate schema
npx prisma db pull

# Push schema to DB without migration (prototyping)
npx prisma db push

# Seed database
npx prisma db seed
`;

// ---- 3. PRISMA CLIENT SETUP ----

const { PrismaClient } = require("@prisma/client");

// Singleton pattern (important for Next.js and dev hot-reload)
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ["query", "error", "warn"], // Log SQL queries in development
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ---- 4. CRUD OPERATIONS ----

async function crudExamples() {
  // CREATE
  const user = await prisma.user.create({
    data: {
      email: "alice@test.com",
      username: "alice",
      password: "hashed_password",
      profile: {
        create: { avatar: "avatar.jpg" }, // Create related record
      },
    },
    include: { profile: true }, // Include relation in response
  });

  // CREATE MANY
  const count = await prisma.user.createMany({
    data: [
      { email: "bob@test.com", username: "bob", password: "hash" },
      { email: "charlie@test.com", username: "charlie", password: "hash" },
    ],
    skipDuplicates: true,
  });

  // READ (single)
  const foundUser = await prisma.user.findUnique({
    where: { email: "alice@test.com" },
  });

  const userById = await prisma.user.findUnique({
    where: { id: 1 },
    include: { posts: true, profile: true },
  });

  // findFirst — returns first matching record
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  // READ (many with filters)
  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      role: { in: ["USER", "MODERATOR"] },
      email: { contains: "@test.com" },
      createdAt: { gte: new Date("2024-01-01") },
    },
    orderBy: { createdAt: "desc" },
    skip: 0,    // Offset
    take: 10,   // Limit
    select: {   // Select specific fields
      id: true,
      username: true,
      email: true,
      _count: { select: { posts: true } },
    },
  });

  // UPDATE
  const updated = await prisma.user.update({
    where: { id: 1 },
    data: { role: "ADMIN", bio: "Hello World" },
  });

  // UPDATE MANY
  await prisma.user.updateMany({
    where: { isActive: false, createdAt: { lt: new Date("2023-01-01") } },
    data: { role: "USER" },
  });

  // UPSERT (create if not exists, update if exists)
  const upserted = await prisma.user.upsert({
    where: { email: "alice@test.com" },
    update: { username: "alice_updated" },
    create: { email: "alice@test.com", username: "alice", password: "hash" },
  });

  // DELETE
  await prisma.user.delete({ where: { id: 5 } });

  // DELETE MANY
  await prisma.user.deleteMany({
    where: { isActive: false },
  });
}

// ---- 5. RELATIONS AND NESTED QUERIES ----

async function relationExamples() {
  // Create with nested relations
  const post = await prisma.post.create({
    data: {
      title: "My First Post",
      content: "Hello World!",
      published: true,
      author: { connect: { id: 1 } },  // Connect to existing user
      tags: {
        connectOrCreate: [
          { where: { name: "javascript" }, create: { name: "javascript" } },
          { where: { name: "tutorial" }, create: { name: "tutorial" } },
        ],
      },
    },
    include: { author: true, tags: true },
  });

  // Query with nested includes
  const userWithPosts = await prisma.user.findUnique({
    where: { id: 1 },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: {
          comments: { include: { author: true } },
          tags: true,
        },
      },
      profile: true,
      _count: { select: { posts: true, comments: true } },
    },
  });
}

// ---- 6. AGGREGATIONS ----

async function aggregations() {
  const stats = await prisma.post.aggregate({
    _count: true,
    _avg: { select: { authorId: true } },
    where: { published: true },
  });

  const groupedPosts = await prisma.post.groupBy({
    by: ["authorId", "published"],
    _count: true,
    having: { authorId: { _count: { gt: 2 } } },
  });
}

// ---- 7. TRANSACTIONS ----

async function transactionExamples() {
  // Sequential transaction
  const [newUser, newPost] = await prisma.$transaction([
    prisma.user.create({
      data: { email: "new@test.com", username: "new", password: "hash" },
    }),
    prisma.post.create({
      data: { title: "Welcome Post", authorId: 1 },
    }),
  ]);

  // Interactive transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: 1 } });
    if (!user) throw new Error("User not found");

    const post = await tx.post.create({
      data: { title: "New post", authorId: user.id },
    });

    await tx.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
    });

    return { user, post };
  });
}

// ---- 8. SEEDING ----

const seedExample = `
// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: {
      email: 'alice@test.com',
      username: 'alice',
      password: 'hashed_password',
      role: 'ADMIN',
      posts: {
        create: [
          { title: 'Getting Started with Prisma', content: '...', published: true },
          { title: 'Advanced Prisma Queries', content: '...', published: false },
        ],
      },
    },
  });

  console.log('Seeded:', alice);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
`;

// Add to package.json: "prisma": { "seed": "node prisma/seed.js" }
// Run: npx prisma db seed

console.log("Prisma ORM complete!");
console.log("Key: schema.prisma, migrate, generate, CRUD with Prisma Client");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Design a Prisma schema for an e-commerce app (users, products, orders, order items)
// 2. Write CRUD operations for products with filters (category, price range, search)
// 3. Create a post with tags using connectOrCreate
// 4. Implement paginated user listing with post count
// 5. Write a transaction that creates an order and updates product stock
// 6. Create a seed script that populates your database with test data
