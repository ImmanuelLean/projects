// ============================================
// TYPESCRIPT WITH EXPRESS & NODE.js
// ============================================
// npm install express @types/express
// npm install -D typescript ts-node @types/node

import { Request, Response, NextFunction, Router } from "express";

// ===== TYPED REQUEST/RESPONSE =====

// Generic request with typed body, params, query
interface TypedRequest<
  Body = unknown,
  Params = Record<string, string>,
  Query = Record<string, string>
> extends Request {
  body: Body;
  params: Params;
  query: Query & Record<string, string>;
}

// ===== TYPED ROUTE HANDLERS =====

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}

interface UserParams {
  id: string;
}

interface UserQuery {
  page?: string;
  limit?: string;
  search?: string;
}

// Controller with typed request
const createUser = async (
  req: TypedRequest<CreateUserBody>,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body; // fully typed
  // ... create user
  res.status(201).json({ id: 1, name, email });
};

const getUser = async (
  req: TypedRequest<never, UserParams>,
  res: Response
): Promise<void> => {
  const { id } = req.params; // string
  const userId = parseInt(id, 10);
  // ... find user
  res.json({ id: userId, name: "Alice" });
};

const listUsers = async (
  req: TypedRequest<never, Record<string, string>, UserQuery>,
  res: Response
): Promise<void> => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "20", 10);
  const search = req.query.search || "";
  // ... query users
  res.json({ users: [], pagination: { page, limit, total: 0 } });
};

// ===== TYPED MIDDLEWARE =====

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: "admin" | "user";
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  // verify token...
  req.userId = 1;        // now typed on all requests
  req.userRole = "admin";
  next();
};

// Role check middleware factory
const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
};

// ===== TYPED ERROR HANDLER =====

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string = "INTERNAL_ERROR"
  ) {
    super(message);
  }

  static badRequest(msg: string) { return new ApiError(400, msg, "BAD_REQUEST"); }
  static notFound(msg: string) { return new ApiError(404, msg, "NOT_FOUND"); }
  static unauthorized(msg = "Unauthorized") { return new ApiError(401, msg, "UNAUTHORIZED"); }
}

const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
    return;
  }
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
};

// ===== ASYNC HANDLER WRAPPER =====

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
// router.get('/users', asyncHandler(async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// }));

// ===== TYPED ROUTER =====

const router = Router();

// router.get('/users', asyncHandler(listUsers));
// router.get('/users/:id', asyncHandler(getUser));
// router.post('/users', authMiddleware, asyncHandler(createUser));
// router.delete('/users/:id', authMiddleware, requireRole('admin'), asyncHandler(deleteUser));

// ===== ENVIRONMENT VARIABLES =====

interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  NODE_ENV: "development" | "production" | "test";
  REDIS_URL?: string;
}

function loadEnv(): EnvConfig {
  const required = ["DATABASE_URL", "JWT_SECRET"] as const;
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }

  return {
    PORT: parseInt(process.env.PORT || "3000", 10),
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    NODE_ENV: (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
    REDIS_URL: process.env.REDIS_URL,
  };
}

// ===== TYPED PRISMA PATTERNS =====

const prismaPatterns = `
import { PrismaClient, User, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Prisma generates types from your schema!
async function findUsers(
  where: Prisma.UserWhereInput,
  orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: 'desc' }
): Promise<User[]> {
  return prisma.user.findMany({ where, orderBy });
}

// Select specific fields — return type is inferred
async function getUserPreview(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  });
  // Return type: { id: number; name: string; email: string } | null
}

// With relations
async function getUserWithPosts(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      posts: {
        select: { id: true, title: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });
}
`;

// ===== VALIDATION WITH ZOD =====

const zodValidation = `
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, 'Must contain uppercase'),
  age: z.number().int().min(13).max(120).optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

// Infer TypeScript type from Zod schema!
type CreateUserInput = z.infer<typeof createUserSchema>;
// { name: string; email: string; password: string; age?: number; role: "user" | "admin" }

// Validation middleware
const validate = <T extends z.ZodType>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.errors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
};

// Usage: router.post('/users', validate(createUserSchema), createUser);
`;

console.log("=== TypeScript + Express Patterns ===");
console.log("Typed requests, middleware, error handling, Prisma, Zod validation");

export {};
