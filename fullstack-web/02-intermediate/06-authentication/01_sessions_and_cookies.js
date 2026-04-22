// ============================================
// SESSIONS AND COOKIES
// ============================================
// Install: npm install express express-session connect-mongo bcrypt

const express = require("express");
const session = require("express-session");
// const MongoStore = require('connect-mongo');
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- 1. COOKIES ----

// Cookies = small data stored in the browser, sent with every request
// Set cookie
app.get("/set-cookie", (req, res) => {
  res.cookie("theme", "dark", {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    httpOnly: true,    // Can't be accessed by JavaScript (security)
    secure: false,     // true in production (HTTPS only)
    sameSite: "lax",   // CSRF protection (lax, strict, none)
    path: "/",         // Available on all paths
  });
  res.json({ message: "Cookie set!" });
});

// Read cookie (need cookie-parser middleware)
// npm install cookie-parser
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
// req.cookies.theme → "dark"

// Delete cookie
app.get("/clear-cookie", (req, res) => {
  res.clearCookie("theme");
  res.json({ message: "Cookie cleared!" });
});

// ---- 2. SESSION SETUP ----

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-prod",
    resave: false,                // Don't save session if not modified
    saveUninitialized: false,     // Don't create session until something stored
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      httpOnly: true,             // Not accessible via JavaScript
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
    },
    // Store sessions in MongoDB (instead of memory)
    // store: MongoStore.create({
    //   mongoUrl: process.env.MONGODB_URI,
    //   ttl: 24 * 60 * 60, // 1 day in seconds
    // }),
  })
);

// ---- 3. SIMULATED USER DATABASE ----

const users = [];

// Register
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: "Email already exists" });
  }

  // Hash password (NEVER store plain text passwords!)
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  };
  users.push(user);

  // Create session
  req.session.userId = user.id;
  req.session.username = user.username;

  const { password: _, ...safeUser } = user;
  res.status(201).json({ message: "Registered successfully", user: safeUser });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Regenerate session ID (prevents session fixation attacks)
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: "Session error" });

    req.session.userId = user.id;
    req.session.username = user.username;

    const { password: _, ...safeUser } = user;
    res.json({ message: "Logged in", user: safeUser });
  });
});

// ---- 4. AUTHENTICATION MIDDLEWARE ----

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Please log in" });
  }
  next();
}

// Protected route
app.get("/api/profile", requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.session.userId);
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.get("/api/dashboard", requireAuth, (req, res) => {
  res.json({
    message: `Welcome, ${req.session.username}!`,
    sessionId: req.sessionID,
  });
});

// ---- 5. LOGOUT ----

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid"); // Default session cookie name
    res.json({ message: "Logged out" });
  });
});

// ---- 6. SESSION vs COOKIES vs JWT ----

const comparison = `
COOKIES:
  - Stored in browser, sent with every request
  - Can store small data (4KB limit)
  - Set by server via Set-Cookie header
  - Use httpOnly + secure flags for security

SESSIONS:
  - Server-side storage (memory, database, Redis)
  - Client gets a session ID cookie
  - More secure (data stays on server)
  - Requires server-side state (doesn't scale horizontally easily)
  - Good for: traditional web apps, MPA

JWT (JSON Web Tokens):
  - Token contains the data (self-contained)
  - Stateless (no server-side storage needed)
  - Scales horizontally (any server can verify)
  - Can't be easily revoked
  - Good for: APIs, SPAs, microservices
`;

// ---- 7. SECURITY BEST PRACTICES ----

// 1. Always hash passwords with bcrypt (salt rounds >= 10)
// 2. Use httpOnly cookies (prevents XSS access to cookies)
// 3. Use secure flag in production (HTTPS only)
// 4. Set sameSite to 'lax' or 'strict' (CSRF protection)
// 5. Regenerate session ID after login (prevents session fixation)
// 6. Set reasonable session expiry (24h for web, shorter for sensitive apps)
// 7. Store sessions in a database, not memory (memory leaks, lost on restart)
// 8. Never expose session IDs in URLs
// 9. Use a strong, random session secret (env variable)
// 10. Rate limit login attempts

app.listen(3000, () => console.log("Session auth server on port 3000"));

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Implement registration with password hashing and session creation
// 2. Build login with session regeneration and proper error messages
// 3. Create authentication middleware and apply to protected routes
// 4. Implement logout that destroys session and clears cookies
// 5. Store sessions in MongoDB using connect-mongo
// 6. Add "remember me" functionality with longer session duration
