// ============================================
// EXPRESS ERROR HANDLING
// ============================================

const express = require("express");
const app = express();
app.use(express.json());

// ---- 1. CUSTOM ERROR CLASS ----

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes expected errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404);
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super("Validation failed", 400);
    this.errors = errors;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// ---- 2. ASYNC ERROR WRAPPER ----

// Catches async errors and passes them to Express error handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ---- 3. ROUTES WITH ERROR HANDLING ----

// Simulated database
const users = [
  { id: 1, name: "Alice", email: "alice@test.com" },
  { id: 2, name: "Bob", email: "bob@test.com" },
];

// GET all users
app.get("/api/users", asyncHandler(async (req, res) => {
  res.json({ users });
}));

// GET user by ID — throws 404 if not found
app.get("/api/users/:id", asyncHandler(async (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) throw new NotFoundError("User");
  res.json({ user });
}));

// POST create user — validation errors
app.post("/api/users", asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  }
  if (!email || !email.includes("@")) {
    errors.push({ field: "email", message: "Valid email is required" });
  }
  if (users.find((u) => u.email === email)) {
    errors.push({ field: "email", message: "Email already exists" });
  }

  if (errors.length) throw new ValidationError(errors);

  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json({ user: newUser });
}));

// Simulated server error
app.get("/api/error", asyncHandler(async (req, res) => {
  // Unhandled error — will be caught by global handler
  throw new Error("Something unexpected happened!");
}));

// ---- 4. ERROR-HANDLING MIDDLEWARE ----

// 404 handler — must be AFTER all routes
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url}`));
});

// Global error handler — must have 4 parameters
app.use((err, req, res, next) => {
  // Log error
  if (!err.isOperational) {
    console.error("UNEXPECTED ERROR:", err.stack);
  } else {
    console.error(`${err.statusCode} - ${err.message}`);
  }

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Build response
  const response = {
    status: "error",
    message: err.isOperational ? err.message : "Internal server error",
  };

  // Include validation errors if present
  if (err.errors) {
    response.errors = err.errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

// ---- 5. COMMON ERROR PATTERNS ----

// Pattern: Try-catch in controllers
// (The asyncHandler above does this automatically)

// Pattern: Centralized error response format
// Always return consistent error JSON:
// { status: "error", message: "...", errors: [...] }

// Pattern: Operational vs Programming errors
// Operational: expected (404, validation) → send error response
// Programming: bugs (TypeError, null ref) → log, restart, 500 response

// Pattern: Express-async-errors package (auto-wraps all routes)
// npm install express-async-errors
// require('express-async-errors'); // Just require at top — done!

// ---- 6. PROCESS-LEVEL ERROR HANDLING ----

// Catch unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION:", reason);
  // In production: log to error tracking service, then gracefully shut down
  // server.close(() => process.exit(1));
});

// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1); // Must exit — state is unreliable
});

app.listen(3000, () => console.log("Error handling demo on port 3000"));

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create custom error classes for NotFound, Unauthorized, Forbidden, and BadRequest
// 2. Build an asyncHandler wrapper and use it with all async route handlers
// 3. Implement a global error handler that returns consistent JSON error responses
// 4. Add different error responses for development vs production environments
// 5. Handle a database connection failure gracefully with retry logic
