// ============================================
// MVC ARCHITECTURE & PROJECT STRUCTURE
// ============================================
// Organizing full-stack Express applications

// ---- 1. PROJECT STRUCTURE ----

const projectStructure = `
  my-app/
  ├── src/
  │   ├── config/
  │   │   ├── database.js       # DB connection
  │   │   ├── env.js            # Environment variables
  │   │   └── cors.js           # CORS config
  │   │
  │   ├── models/               # Data layer (M)
  │   │   ├── User.js
  │   │   ├── Post.js
  │   │   └── Comment.js
  │   │
  │   ├── controllers/          # Business logic (C)
  │   │   ├── authController.js
  │   │   ├── userController.js
  │   │   └── postController.js
  │   │
  │   ├── routes/               # Route definitions
  │   │   ├── index.js          # Route aggregator
  │   │   ├── authRoutes.js
  │   │   ├── userRoutes.js
  │   │   └── postRoutes.js
  │   │
  │   ├── middleware/           # Custom middleware
  │   │   ├── auth.js           # JWT verification
  │   │   ├── validate.js       # Request validation
  │   │   ├── errorHandler.js   # Centralized error handling
  │   │   └── rateLimiter.js
  │   │
  │   ├── services/             # Business logic layer
  │   │   ├── authService.js
  │   │   ├── userService.js
  │   │   ├── emailService.js
  │   │   └── uploadService.js
  │   │
  │   ├── utils/                # Helper functions
  │   │   ├── ApiError.js       # Custom error class
  │   │   ├── asyncHandler.js   # Async error wrapper
  │   │   ├── logger.js
  │   │   └── helpers.js
  │   │
  │   ├── validators/           # Request validation schemas
  │   │   ├── authValidator.js
  │   │   └── userValidator.js
  │   │
  │   └── app.js                # Express app setup
  │
  ├── tests/
  │   ├── unit/
  │   ├── integration/
  │   └── fixtures/
  │
  ├── prisma/
  │   └── schema.prisma         # Database schema
  │
  ├── .env                      # Environment variables
  ├── .env.example              # Template
  ├── package.json
  └── server.js                 # Entry point
`;

// ---- 2. APP SETUP ----

const appSetup = `
// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ===== Global Middleware =====
app.use(helmet());                       // Security headers
app.use(cors());                         // CORS
app.use(morgan('dev'));                   // Request logging
app.use(express.json({ limit: '10mb' })); // Parse JSON
app.use(express.urlencoded({ extended: true }));

// ===== Routes =====
app.use('/api', routes);

// ===== Health Check =====
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ===== Error Handler (must be last) =====
app.use(errorHandler);

module.exports = app;
`;

// ---- 3. MODEL LAYER ----

const modelLayer = `
// src/models/User.js (Prisma example)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserModel {
  static async findAll({ page = 1, limit = 20, search = '' } = {}) {
    const where = search
      ? { OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]}
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page, limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: { posts: { take: 10 } },
    });
  }

  static async create(data) {
    return prisma.user.create({ data });
  }

  static async update(id, data) {
    return prisma.user.update({ where: { id }, data });
  }

  static async delete(id) {
    return prisma.user.delete({ where: { id } });
  }

  static async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }
}

module.exports = UserModel;
`;

// ---- 4. CONTROLLER LAYER ----

const controllerLayer = `
// src/controllers/userController.js
const UserModel = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/users
exports.getUsers = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const result = await UserModel.findAll({
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    search,
  });
  res.json(result);
});

// GET /api/users/:id
exports.getUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json(user);
});

// POST /api/users
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await UserModel.findByEmail(email);
  if (existing) throw new ApiError(409, 'Email already registered');

  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({ name, email, password: hashedPassword });
  const { password: _, ...safeUser } = user;
  res.status(201).json(safeUser);
});

// PUT /api/users/:id
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await UserModel.update(req.params.id, req.body);
  res.json(user);
});

// DELETE /api/users/:id
exports.deleteUser = asyncHandler(async (req, res) => {
  await UserModel.delete(req.params.id);
  res.status(204).send();
});
`;

// ---- 5. ROUTES ----

const routesLayer = `
// src/routes/userRoutes.js
const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createUserSchema, updateUserSchema } = require('../validators/userValidator');

router.get('/', auth, userController.getUsers);
router.get('/:id', auth, userController.getUser);
router.post('/', auth, validate(createUserSchema), userController.createUser);
router.put('/:id', auth, validate(updateUserSchema), userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;

// src/routes/index.js
const router = require('express').Router();
router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/posts', require('./postRoutes'));
module.exports = router;
`;

// ---- 6. UTILITIES ----

const utilities = `
// src/utils/ApiError.js
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
  }

  static badRequest(msg) { return new ApiError(400, msg); }
  static unauthorized(msg = 'Unauthorized') { return new ApiError(401, msg); }
  static forbidden(msg = 'Forbidden') { return new ApiError(403, msg); }
  static notFound(msg = 'Not found') { return new ApiError(404, msg); }
}
module.exports = ApiError;

// src/utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
module.exports = asyncHandler;

// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  console.error(err.stack);

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
module.exports = errorHandler;

// src/middleware/validate.js
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.errors,
    });
  }
  req.body = result.data;  // use parsed/transformed data
  next();
};
module.exports = validate;
`;

// ---- 7. SERVICE LAYER ----

const serviceLayer = `
// src/services/emailService.js
class EmailService {
  async sendWelcome(user) {
    // In production: use nodemailer, SendGrid, etc.
    console.log(\`Sending welcome email to \${user.email}\`);
  }

  async sendPasswordReset(email, token) {
    const resetUrl = \`\${process.env.FRONTEND_URL}/reset-password?token=\${token}\`;
    console.log(\`Password reset link: \${resetUrl}\`);
  }
}
module.exports = new EmailService();

// Service layer sits between controller and model:
// Controller → Service → Model
// Controller handles HTTP, Service handles business logic, Model handles data
`;

console.log("=== MVC Architecture Summary ===");
console.log(`
  Layers:
    Routes       → URL mapping, middleware chain
    Controllers  → HTTP handling, request/response
    Services     → Business logic, orchestration
    Models       → Data access, database queries
    Middleware   → Auth, validation, error handling
    Utils        → Shared helpers, custom errors

  Principles:
    Single Responsibility — each layer has one job
    Separation of Concerns — layers don't know about each other's internals
    Dependency Inversion — depend on abstractions, not concretions
`);
