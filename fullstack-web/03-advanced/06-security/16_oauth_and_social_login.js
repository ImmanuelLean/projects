// ============================================
// OAUTH 2.0 & SOCIAL LOGIN
// ============================================
// npm install passport passport-google-oauth20 passport-github2

// ---- 1. OAUTH 2.0 FLOW ----

const oauthFlow = `
  Authorization Code Grant Flow:

  1. User clicks "Login with Google"
  2. App redirects to Google's auth page
  3. User logs in and grants permission
  4. Google redirects back with an authorization CODE
  5. Server exchanges code for ACCESS TOKEN (server-to-server)
  6. Server uses access token to fetch user profile
  7. Server creates session/JWT for the user

  Why this flow?
  - Authorization code is short-lived and useless without client_secret
  - Access token never exposed to the browser
  - Most secure flow for web apps
`;

// ---- 2. PASSPORT.JS SETUP ----

const passportSetup = `
// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// ===== Google Strategy =====
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0]?.value,
          provider: 'google',
        });
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

// ===== GitHub Strategy =====
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/auth/github/callback',
    scope: ['user:email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        const email = profile.emails?.[0]?.value || null;
        user = await User.create({
          githubId: profile.id,
          name: profile.displayName || profile.username,
          email,
          avatar: profile.photos[0]?.value,
          provider: 'github',
        });
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

// Serialize/Deserialize (for sessions)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
`;

// ---- 3. AUTH ROUTES ----

const authRoutes = `
// routes/authRoutes.js
const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// ===== Google Auth =====
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT for the authenticated user
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(\`\${process.env.FRONTEND_URL}/auth/callback?token=\${token}\`);
  }
);

// ===== GitHub Auth =====
router.get('/github',
  passport.authenticate('github', {
    scope: ['user:email'],
  })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(\`\${process.env.FRONTEND_URL}/auth/callback?token=\${token}\`);
  }
);

// ===== Get Current User =====
router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

module.exports = router;
`;

// ---- 4. FRONTEND INTEGRATION ----

const frontendIntegration = `
// React: Social login buttons
function LoginPage() {
  const API_URL = process.env.REACT_APP_API_URL;

  return (
    <div className="login-page">
      <h1>Sign In</h1>

      <a href={\`\${API_URL}/api/auth/google\`} className="social-btn google">
        <GoogleIcon /> Continue with Google
      </a>

      <a href={\`\${API_URL}/api/auth/github\`} className="social-btn github">
        <GitHubIcon /> Continue with GitHub
      </a>

      <div className="divider">OR</div>

      <EmailLoginForm />
    </div>
  );
}

// Callback page: receives token from URL
function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      navigate('/login?error=auth_failed');
    }
  }, []);

  return <p>Authenticating...</p>;
}
`;

// ---- 5. ROLE-BASED ACCESS CONTROL (RBAC) ----

const rbac = `
// ===== User Model with Roles =====
// roles: 'user', 'moderator', 'admin', 'superadmin'
const userSchema = {
  id: 'int',
  email: 'string',
  role: 'string',       // 'user' | 'admin' | 'moderator'
  permissions: 'string[]', // fine-grained: ['posts:read', 'posts:write', 'users:manage']
};

// ===== Role Middleware =====
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage
app.get('/api/admin/dashboard', auth, requireRole('admin', 'superadmin'), (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

app.delete('/api/users/:id', auth, requireRole('admin'), userController.deleteUser);

// ===== Permission-Based Access =====
function requirePermission(...permissions) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Auth required' });

    const hasAll = permissions.every(p => req.user.permissions.includes(p));
    if (!hasAll) return res.status(403).json({ error: 'Insufficient permissions' });

    next();
  };
}

// Usage
app.put('/api/posts/:id',
  auth,
  requirePermission('posts:write'),
  postController.updatePost
);

app.delete('/api/posts/:id',
  auth,
  requirePermission('posts:delete'),
  postController.deletePost
);
`;

// ---- 6. TOKEN REFRESH PATTERN ----

const tokenRefresh = `
// ===== Access + Refresh Token Pattern =====
// Access token: short-lived (15 min), used for API calls
// Refresh token: long-lived (7 days), used only to get new access token

function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

// Login: return both tokens
app.post('/api/auth/login', async (req, res) => {
  const user = await authenticateUser(req.body);
  const tokens = generateTokens(user);

  // Store refresh token in httpOnly cookie
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken: tokens.accessToken, user });
});

// Refresh: exchange refresh token for new access token
app.post('/api/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const tokens = generateTokens(user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true, secure: true, sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: tokens.accessToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
`;

console.log("=== OAuth & Auth Summary ===");
console.log(`
  OAuth 2.0 Flow:
    Redirect → Auth provider → Callback → Token → Session/JWT

  Passport.js Strategies:
    passport-google-oauth20, passport-github2,
    passport-facebook, passport-twitter

  RBAC:
    Role middleware: requireRole('admin')
    Permission middleware: requirePermission('posts:write')

  Token Pattern:
    Access token (short) + Refresh token (long, httpOnly cookie)
`);
