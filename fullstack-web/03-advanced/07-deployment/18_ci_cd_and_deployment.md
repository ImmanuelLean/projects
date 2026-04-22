# ============================================
# CI/CD & DEPLOYMENT
# ============================================

## 1. CI/CD Concepts

```
CI (Continuous Integration):
  Push code → Auto run tests → Auto run linter → Report results

CD (Continuous Deployment):
  Tests pass → Auto deploy to staging/production

Pipeline:
  Push → Lint → Test → Build → Deploy
```

---

## 2. GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # ===== Lint & Type Check =====
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check  # if using TypeScript

  # ===== Unit Tests =====
  test:
    runs-on: ubuntu-latest
    needs: lint

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/test_db
      - run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/test_db
          JWT_SECRET: test-secret-key
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  # ===== Build =====
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  # ===== Deploy to Production =====
  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      # Deploy to Railway/Render/Vercel
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: my-api

      # Or deploy Docker image
      - name: Build & Push Docker
        run: |
          docker build -t registry.example.com/my-app:${{ github.sha }} .
          docker push registry.example.com/my-app:${{ github.sha }}
```

## 3. Deployment Platforms

### Vercel (Frontend + Serverless)
```bash
# Install
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod

# Environment variables
vercel env add DATABASE_URL
```

### Railway (Backend + Database)
```bash
# Install
npm i -g @railway/cli

# Login & deploy
railway login
railway init
railway up

# Add PostgreSQL
railway add --plugin postgresql

# Environment variables are auto-injected
```

### Render
```yaml
# render.yaml
services:
  - type: web
    name: my-api
    env: node
    buildCommand: npm ci && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: mydb
          property: connectionString

databases:
  - name: mydb
    plan: free
```

### DigitalOcean / AWS (VPS)
```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Clone and setup
git clone https://github.com/you/my-app.git
cd my-app
npm ci --production
npm run build

# PM2 process manager
sudo npm install -g pm2
pm2 start dist/server.js --name my-app
pm2 startup    # auto-start on reboot
pm2 save

# Nginx reverse proxy
sudo apt install nginx
```

## 4. PM2 Process Manager

```bash
# Start app
pm2 start server.js --name my-api -i max  # cluster mode (all CPUs)

# Management
pm2 list                 # list processes
pm2 logs my-api          # view logs
pm2 restart my-api       # restart
pm2 reload my-api        # zero-downtime reload
pm2 stop my-api
pm2 delete my-api

# Monitoring
pm2 monit               # real-time dashboard

# Ecosystem file
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-api',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
};

# Deploy with ecosystem
pm2 start ecosystem.config.js --env production
```

## 5. SSL/TLS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d myapp.com -d www.myapp.com

# Auto-renewal (cron)
sudo certbot renew --dry-run
# Certbot adds auto-renewal timer automatically
```

## 6. Environment Management

```
Environments:
  development  → localhost, debug mode, local DB
  staging      → staging.myapp.com, production-like, test DB
  production   → myapp.com, optimized, production DB

Branch Strategy:
  feature/* → develop → staging → main → production

  feature/add-auth  →  PR to develop
  develop           →  auto-deploy to staging
  main              →  auto-deploy to production
```

## 7. Health Checks & Monitoring

```javascript
// Health endpoint
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');  // check DB
    res.json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      memory: process.memoryUsage(),
    });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

// Logging (use structured logging)
// npm install winston
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

## 8. Deployment Checklist

```
Pre-Deploy:
  ✅ All tests passing
  ✅ Environment variables set
  ✅ Database migrations ready
  ✅ Build succeeds
  ✅ No hardcoded secrets

Production:
  ✅ HTTPS enabled
  ✅ CORS configured for production domains
  ✅ Rate limiting enabled
  ✅ Error logging (not console.log)
  ✅ Health check endpoint
  ✅ PM2 or Docker for process management
  ✅ Backups configured
  ✅ Monitoring/alerting set up
```
