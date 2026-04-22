// ============================================
// JWT (JSON WEB TOKENS) AUTHENTICATION
// ============================================
// Install: npm install jsonwebtoken bcrypt express dotenv

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-me";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret-change-me";

// ---- 1. HOW JWT WORKS ----

// JWT = Header.Payload.Signature (base64 encoded, separated by dots)
// Header:  { "alg": "HS256", "typ": "JWT" }
// Payload: { "userId": 1, "role": "admin", "iat": 1234567890, "exp": ... }
// Signature: HMACSHA256(header + payload, secret)

// The server creates and signs the token
// The client stores it and sends it with every request
// The server verifies the signature — no database lookup needed!

// ---- 2. GENERATE TOKENS ----

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" } // Short-lived access token
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Long-lived refresh token
  );
}

// ---- 3. SIMULATED DATABASE ----

const users = [];
const refreshTokens = new Set(); // In production: store in database

// ---- 4. AUTH ROUTES ----

// Register
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
    role: "user",
    createdAt: new Date(),
  };
  users.push(user);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.add(refreshToken);

  res.status(201).json({
    message: "Registered successfully",
    user: { id: user.id, username, email, role: user.role },
    accessToken,
    refreshToken,
  });
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.add(refreshToken);

  res.json({
    message: "Logged in",
    user: { id: user.id, username: user.username, email, role: user.role },
    accessToken,
    refreshToken,
  });
});

// Refresh token — get new access token without re-login
app.post("/api/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }
  if (!refreshTokens.has(refreshToken)) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = users.find((u) => u.id === decoded.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    refreshTokens.delete(refreshToken);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
});

// Logout — invalidate refresh token
app.post("/api/auth/logout", (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) refreshTokens.delete(refreshToken);
  res.json({ message: "Logged out" });
});

// ---- 5. AUTH MIDDLEWARE ----

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, email, role }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
    }
    res.status(401).json({ error: "Invalid token" });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

// ---- 6. PROTECTED ROUTES ----

app.get("/api/profile", authenticate, (req, res) => {
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.get("/api/admin", authenticate, authorize("admin"), (req, res) => {
  res.json({ message: "Admin area", user: req.user });
});

app.put("/api/profile", authenticate, async (req, res) => {
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { username, email } = req.body;
  if (username) user.username = username;
  if (email) user.email = email;

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// ---- 7. CLIENT-SIDE USAGE ----

const clientUsage = `
// Store tokens
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);

// Send token with requests
fetch('/api/profile', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
    'Content-Type': 'application/json',
  },
});

// Auto-refresh on 401
async function fetchWithAuth(url, options = {}) {
  options.headers = {
    ...options.headers,
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
  };

  let response = await fetch(url, options);

  if (response.status === 401) {
    // Try refreshing the token
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: localStorage.getItem('refreshToken'),
      }),
    });

    if (refreshResponse.ok) {
      const { accessToken } = await refreshResponse.json();
      localStorage.setItem('accessToken', accessToken);
      options.headers['Authorization'] = 'Bearer ' + accessToken;
      response = await fetch(url, options); // Retry original request
    } else {
      // Refresh failed — redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
  }

  return response;
}
`;

// ---- 8. SECURITY BEST PRACTICES ----

// 1. Use strong secrets (minimum 256 bits) stored in env variables
// 2. Keep access tokens short-lived (15 min)
// 3. Store refresh tokens in database (allow revocation)
// 4. Use HTTPS in production
// 5. Don't store sensitive data in JWT payload (it's only base64, not encrypted)
// 6. Consider httpOnly cookies for token storage (prevents XSS)
// 7. Implement token rotation (issue new refresh token with each refresh)
// 8. Rate limit auth endpoints
// 9. Validate password strength on registration

app.listen(3000, () => console.log("JWT auth server on port 3000"));

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Implement full JWT auth flow: register, login, refresh, logout
// 2. Create middleware for authentication and role-based authorization
// 3. Implement token refresh with rotation (new refresh token each time)
// 4. Build a client-side fetchWithAuth that auto-refreshes expired tokens
// 5. Add password change endpoint that invalidates all existing tokens
// 6. Compare JWT vs Sessions: when would you use each?
