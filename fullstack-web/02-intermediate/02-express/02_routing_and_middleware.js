// ============================================
// EXPRESS ROUTING AND MIDDLEWARE
// ============================================

const express = require("express");
const app = express();

// ---- 1. MIDDLEWARE CONCEPT ----
// Middleware = functions that run between request and response
// They have access to req, res, and next()
// Order matters! Middleware runs in the order it's defined.

// Basic middleware structure
function myMiddleware(req, res, next) {
  console.log("Middleware ran!");
  next(); // Pass to next middleware/route handler
}

// ---- 2. APPLICATION-LEVEL MIDDLEWARE ----

// Runs on EVERY request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Built-in middleware
app.use(express.json());                          // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));   // Parse form data
app.use(express.static("public"));                 // Serve static files

// Third-party middleware
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// app.use(cors());                  // Enable CORS
// app.use(helmet());                // Security headers
// app.use(morgan('dev'));           // Request logging

// ---- 3. CUSTOM MIDDLEWARE EXAMPLES ----

// Request timing
function requestTimer(req, res, next) {
  req.startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - req.startTime;
    console.log(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  next();
}
app.use(requestTimer);

// Authentication middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    // In real app: verify JWT token
    req.user = { id: 1, name: "Alice", role: "admin" };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Authorization middleware (check role)
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

// Validation middleware
function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];
    for (const [field, rules] of Object.entries(schema)) {
      if (rules.required && !req.body[field]) {
        errors.push(`${field} is required`);
      }
      if (rules.type && req.body[field] && typeof req.body[field] !== rules.type) {
        errors.push(`${field} must be a ${rules.type}`);
      }
    }
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    next();
  };
}

// Rate limiting (simple in-memory)
function rateLimit(windowMs, maxRequests) {
  const requests = new Map();
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    const timestamps = (requests.get(ip) || []).filter((t) => t > windowStart);
    if (timestamps.length >= maxRequests) {
      return res.status(429).json({ error: "Too many requests" });
    }
    timestamps.push(now);
    requests.set(ip, timestamps);
    next();
  };
}

// ---- 4. ROUTE-LEVEL MIDDLEWARE ----

// Apply middleware to specific routes
app.get("/api/public", (req, res) => {
  res.json({ message: "Public data" });
});

app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "Protected data", user: req.user });
});

app.delete(
  "/api/admin/users/:id",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.json({ message: `Deleted user ${req.params.id}` });
  }
);

// Multiple middleware in sequence
app.post(
  "/api/users",
  authenticate,
  validateBody({
    name: { required: true, type: "string" },
    email: { required: true, type: "string" },
  }),
  (req, res) => {
    res.status(201).json({ user: req.body });
  }
);

// ---- 5. EXPRESS ROUTER ----

// Modular routing — split routes into separate files
const userRouter = express.Router();

// All routes here are prefixed with whatever path we mount on
userRouter.get("/", (req, res) => {
  res.json({ users: [{ id: 1, name: "Alice" }] });
});

userRouter.get("/:id", (req, res) => {
  res.json({ user: { id: req.params.id, name: "Alice" } });
});

userRouter.post(
  "/",
  validateBody({ name: { required: true } }),
  (req, res) => {
    res.status(201).json({ user: { id: 2, ...req.body } });
  }
);

userRouter.put("/:id", (req, res) => {
  res.json({ user: { id: req.params.id, ...req.body } });
});

userRouter.delete("/:id", (req, res) => {
  res.status(204).send();
});

// Mount router at a prefix
app.use("/api/users", userRouter);

// In a real project, you'd put each router in its own file:
// routes/users.js → exports userRouter
// routes/products.js → exports productRouter
// app.js → app.use('/api/users', require('./routes/users'));

// ---- 6. ROUTER-LEVEL MIDDLEWARE ----

const adminRouter = express.Router();

// Apply middleware to ALL routes in this router
adminRouter.use(authenticate);
adminRouter.use(authorize("admin"));

adminRouter.get("/dashboard", (req, res) => {
  res.json({ dashboard: "admin data" });
});

adminRouter.get("/settings", (req, res) => {
  res.json({ settings: {} });
});

app.use("/api/admin", adminRouter);

// ---- 7. ROUTE CHAINING ----

app
  .route("/api/products")
  .get((req, res) => {
    res.json({ products: [] });
  })
  .post((req, res) => {
    res.status(201).json({ product: req.body });
  });

app
  .route("/api/products/:id")
  .get((req, res) => res.json({ id: req.params.id }))
  .put((req, res) => res.json({ updated: true }))
  .delete((req, res) => res.status(204).send());

// ---- 8. ERROR HANDLING MIDDLEWARE ----

// Async error wrapper
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Route that might throw
app.get(
  "/api/risky",
  asyncHandler(async (req, res) => {
    // If this throws, it goes to error handler automatically
    const data = await Promise.resolve({ result: "data" });
    res.json(data);
  })
);

// 404 handler (after all routes)
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// Global error handler (4 params — must have all four!)
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : err.message,
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create a logging middleware that logs method, URL, status code, and response time
// 2. Build an authentication middleware that checks for an API key in headers
// 3. Create a Router for /api/posts with full CRUD routes
// 4. Implement rate limiting middleware (max 100 requests per 15 minutes per IP)
// 5. Create an async error wrapper and use it with async route handlers
// 6. Build a validation middleware that checks required fields from a schema
