// ============================================
// API / INTEGRATION TESTING
// ============================================
// npm install --save-dev supertest jest

// ---- 1. SUPERTEST BASICS ----

const supertestBasics = `
// Setup: separate app from server for testing
// app.js — exports app (no .listen)
// server.js — imports app and calls .listen

// app.js
const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  res.status(201).json({ id: 3, name, email });
});

module.exports = app;

// __tests__/api.test.js
const request = require('supertest');
const app = require('../app');

describe('API Endpoints', () => {

  // ===== GET =====
  describe('GET /api/health', () => {
    it('returns health status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  // ===== GET with response validation =====
  describe('GET /api/users', () => {
    it('returns array of users', async () => {
      const res = await request(app)
        .get('/api/users')
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toMatchObject({ id: 1, name: 'Alice' });
    });
  });

  // ===== POST =====
  describe('POST /api/users', () => {
    it('creates a new user', async () => {
      const newUser = { name: 'Charlie', email: 'charlie@test.com' };

      const res = await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Content-Type', 'application/json')
        .expect(201);

      expect(res.body).toMatchObject({
        id: expect.any(Number),
        name: 'Charlie',
        email: 'charlie@test.com',
      });
    });

    it('returns 400 for missing fields', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'Charlie' })  // missing email
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });
});
`;

// ---- 2. AUTHENTICATED ROUTES ----

const authTesting = `
describe('Protected Routes', () => {
  let authToken;

  // Login before tests
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });

    authToken = res.body.token;
  });

  it('returns 401 without token', async () => {
    await request(app)
      .get('/api/admin/users')
      .expect(401);
  });

  it('returns 401 with invalid token', async () => {
    await request(app)
      .get('/api/admin/users')
      .set('Authorization', 'Bearer invalidtoken123')
      .expect(401);
  });

  it('returns data with valid token', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', \`Bearer \${authToken}\`)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
  });

  it('returns 403 for unauthorized role', async () => {
    // Login as regular user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });

    await request(app)
      .get('/api/admin/users')
      .set('Authorization', \`Bearer \${loginRes.body.token}\`)
      .expect(403);
  });
});
`;

// ---- 3. CRUD TESTING ----

const crudTesting = `
describe('Products CRUD', () => {
  let productId;

  // ===== CREATE =====
  it('creates a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', \`Bearer \${token}\`)
      .send({
        name: 'Test Widget',
        price: 29.99,
        category: 'electronics',
      })
      .expect(201);

    productId = res.body.id;
    expect(res.body.name).toBe('Test Widget');
  });

  // ===== READ =====
  it('gets a single product', async () => {
    const res = await request(app)
      .get(\`/api/products/\${productId}\`)
      .expect(200);

    expect(res.body.id).toBe(productId);
  });

  it('returns 404 for non-existent product', async () => {
    await request(app)
      .get('/api/products/99999')
      .expect(404);
  });

  // ===== UPDATE =====
  it('updates a product', async () => {
    const res = await request(app)
      .put(\`/api/products/\${productId}\`)
      .set('Authorization', \`Bearer \${token}\`)
      .send({ price: 39.99 })
      .expect(200);

    expect(res.body.price).toBe(39.99);
  });

  // ===== DELETE =====
  it('deletes a product', async () => {
    await request(app)
      .delete(\`/api/products/\${productId}\`)
      .set('Authorization', \`Bearer \${token}\`)
      .expect(204);

    // Verify deleted
    await request(app)
      .get(\`/api/products/\${productId}\`)
      .expect(404);
  });

  // ===== PAGINATION =====
  it('paginates results', async () => {
    const res = await request(app)
      .get('/api/products?page=1&limit=5')
      .expect(200);

    expect(res.body.data).toHaveLength(5);
    expect(res.body.pagination).toMatchObject({
      page: 1,
      limit: 5,
      total: expect.any(Number),
    });
  });

  // ===== FILTERING =====
  it('filters by category', async () => {
    const res = await request(app)
      .get('/api/products?category=electronics')
      .expect(200);

    res.body.data.forEach(product => {
      expect(product.category).toBe('electronics');
    });
  });
});
`;

// ---- 4. TEST DATABASE SETUP ----

const testDbSetup = `
// test/setup.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.TEST_DATABASE_URL },
  },
});

// Seed test data
async function seedTestData() {
  await prisma.user.createMany({
    data: [
      { name: 'Admin', email: 'admin@test.com', role: 'admin', password: hashedPassword },
      { name: 'User', email: 'user@test.com', role: 'user', password: hashedPassword },
    ],
  });
}

// Clean database
async function cleanDatabase() {
  const tables = ['Comment', 'Post', 'User'];
  for (const table of tables) {
    await prisma[table.toLowerCase()].deleteMany();
  }
}

// Jest global setup
beforeAll(async () => {
  await cleanDatabase();
  await seedTestData();
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterSetup: ['./test/setup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
};
`;

// ---- 5. VALIDATION TESTING ----

const validationTesting = `
describe('Input Validation', () => {

  it('rejects invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'not-an-email', password: 'Password123!' })
      .expect(400);

    expect(res.body.error).toMatch(/email/i);
  });

  it('rejects weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: '123' })
      .expect(400);

    expect(res.body.error).toMatch(/password/i);
  });

  it('rejects SQL injection attempt', async () => {
    const res = await request(app)
      .get("/api/users?search='; DROP TABLE users; --")
      .expect(200);  // should handle safely, not crash

    expect(res.body).toBeInstanceOf(Array);
  });

  it('rejects oversized payload', async () => {
    const largeBody = { data: 'x'.repeat(1024 * 1024 * 20) };  // 20MB
    await request(app)
      .post('/api/data')
      .send(largeBody)
      .expect(413);  // Payload Too Large
  });
});
`;

// ---- 6. FILE UPLOAD TESTING ----

const uploadTesting = `
describe('File Upload', () => {
  it('uploads an image', async () => {
    const res = await request(app)
      .post('/api/upload/avatar')
      .set('Authorization', \`Bearer \${token}\`)
      .attach('avatar', 'test/fixtures/test-image.jpg')
      .expect(200);

    expect(res.body.file).toHaveProperty('url');
    expect(res.body.file.mimetype).toBe('image/jpeg');
  });

  it('rejects non-image files', async () => {
    await request(app)
      .post('/api/upload/avatar')
      .set('Authorization', \`Bearer \${token}\`)
      .attach('avatar', 'test/fixtures/document.pdf')
      .expect(400);
  });

  it('rejects oversized files', async () => {
    await request(app)
      .post('/api/upload/avatar')
      .set('Authorization', \`Bearer \${token}\`)
      .attach('avatar', 'test/fixtures/large-image.jpg')  // > 5MB
      .expect(400);
  });
});
`;

console.log("=== API Testing Summary ===");
console.log(`
  Tools:
    supertest       — HTTP assertions for Express
    jest            — Test runner + assertions
    Prisma/test DB  — Isolated test database

  Test Types:
    Unit tests         — Individual functions/services
    Integration tests  — API endpoints end-to-end
    Validation tests   — Input edge cases
    Auth tests         — Protected routes, roles

  Commands:
    npx jest --testPathPattern=api     — run API tests
    npx jest --coverage                — coverage report
    npm test -- --watchAll             — watch mode
`);
