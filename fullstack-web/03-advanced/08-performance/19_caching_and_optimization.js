// ============================================
// CACHING & PERFORMANCE OPTIMIZATION
// ============================================
// npm install redis compression

// ---- 1. CACHING LAYERS ----

const cachingLayers = `
  Request → Browser Cache → CDN → Server Cache (Redis) → Database

  Layer 1: Browser cache (Cache-Control, ETag)
  Layer 2: CDN (Cloudflare, CloudFront)
  Layer 3: Application cache (Redis, in-memory)
  Layer 4: Database query cache
`;

// ---- 2. HTTP CACHING HEADERS ----

const httpCaching = `
const express = require('express');
const app = express();

// ===== Static Assets: Long Cache =====
app.use('/static', express.static('public', {
  maxAge: '1y',           // cache for 1 year
  immutable: true,        // never revalidate
  etag: true,
}));

// ===== API Responses: Short Cache =====
app.get('/api/products', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=300',  // 5 minutes
    'ETag': '"v1-products-hash"',
  });
  res.json(products);
});

// ===== No Cache (sensitive data) =====
app.get('/api/user/profile', auth, (req, res) => {
  res.set('Cache-Control', 'no-store');  // never cache
  res.json(req.user);
});

// ===== Cache-Control Values =====
// public, max-age=3600       — CDN + browser cache for 1 hour
// private, max-age=3600      — browser only (user-specific data)
// no-cache                   — always revalidate with server
// no-store                   — never cache (sensitive data)
// stale-while-revalidate=60  — serve stale while fetching fresh
`;

// ---- 3. REDIS CACHING ----

const redisCaching = `
const Redis = require('redis');
const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect();

// ===== Cache Middleware =====
function cacheMiddleware(duration = 300) {
  return async (req, res, next) => {
    const key = 'cache:' + req.originalUrl;

    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (err) {
      console.error('Redis error:', err);
    }

    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = async (data) => {
      try {
        await client.setEx(key, duration, JSON.stringify(data));
      } catch (err) {
        console.error('Redis cache error:', err);
      }
      return originalJson(data);
    };

    next();
  };
}

// Usage
app.get('/api/products', cacheMiddleware(300), async (req, res) => {
  const products = await db.product.findMany();
  res.json(products);  // automatically cached for 5 min
});

// ===== Cache Invalidation =====
async function invalidateCache(pattern) {
  const keys = await client.keys('cache:' + pattern);
  if (keys.length > 0) {
    await client.del(keys);
  }
}

// Invalidate when data changes
app.post('/api/products', auth, async (req, res) => {
  const product = await db.product.create({ data: req.body });
  await invalidateCache('/api/products*');  // clear product cache
  res.status(201).json(product);
});

// ===== Cache-Aside Pattern =====
async function getUserById(id) {
  const cacheKey = \`user:\${id}\`;

  // 1. Check cache
  const cached = await client.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Query database
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return null;

  // 3. Store in cache
  await client.setEx(cacheKey, 3600, JSON.stringify(user));

  return user;
}
`;

// ---- 4. IN-MEMORY CACHE ----

const inMemoryCache = `
// Simple in-memory cache (for single-server apps)
class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlSeconds = 300) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key) { this.cache.delete(key); }
  clear() { this.cache.clear(); }
}

const cache = new MemoryCache();

// Usage
app.get('/api/config', (req, res) => {
  let config = cache.get('app-config');
  if (!config) {
    config = loadConfigFromDB();
    cache.set('app-config', config, 600);  // 10 min
  }
  res.json(config);
});

// node-cache package is also good:
// npm install node-cache
// const NodeCache = require('node-cache');
// const cache = new NodeCache({ stdTTL: 300 });
`;

// ---- 5. COMPRESSION ----

const compression = `
const compression = require('compression');

// Gzip/Brotli compression
app.use(compression({
  level: 6,              // compression level (1-9)
  threshold: 1024,       // only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress if client doesn't accept it
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
}));

// Result: JSON responses 70-90% smaller
// API: 50KB → 5KB
// HTML: 100KB → 15KB
`;

// ---- 6. FRONTEND OPTIMIZATION ----

const frontendOptimization = `
// ===== Code Splitting (React) =====
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// ===== Image Optimization =====
// Use next/image (Next.js) or responsive images
<picture>
  <source srcset="image.webp" type="image/webp" />
  <source srcset="image.jpg" type="image/jpeg" />
  <img src="image.jpg" alt="..." loading="lazy" />
</picture>

// ===== Debounce & Throttle =====
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Search: debounce input
const handleSearch = debounce((query) => {
  fetch(\`/api/search?q=\${query}\`);
}, 300);

// Scroll: throttle handler
window.addEventListener('scroll', throttle(() => {
  console.log('scroll position:', window.scrollY);
}, 100));

// ===== Lazy Loading =====
// Images: loading="lazy"
// Routes: React.lazy + Suspense
// Components: dynamic import
// Data: fetch on scroll (infinite scroll)
`;

// ---- 7. DATABASE OPTIMIZATION ----

const dbOptimization = `
// ===== N+1 Problem =====
// ❌ N+1 queries
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } });
}

// ✅ Eager loading (1 query with JOIN)
const users = await prisma.user.findMany({
  include: { posts: true },
});

// ===== Select Only Needed Fields =====
// ❌ Fetch everything
const users = await prisma.user.findMany();

// ✅ Select specific fields
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true },
});

// ===== Connection Pooling =====
// Prisma handles this automatically
// For pg: const pool = new Pool({ max: 20 });

// ===== Pagination =====
// Cursor-based (better for large datasets)
const nextPage = await prisma.post.findMany({
  take: 20,
  skip: 1,
  cursor: { id: lastPostId },
  orderBy: { createdAt: 'desc' },
});
`;

console.log("=== Performance Optimization Summary ===");
console.log(`
  Caching:
    Browser → CDN → Redis → Database cache
    Cache-Control headers for HTTP caching
    Redis for server-side caching
    Cache invalidation on data changes

  Compression:
    Gzip/Brotli (70-90% size reduction)

  Frontend:
    Code splitting, lazy loading, debounce/throttle
    Image optimization (WebP, lazy loading)

  Backend:
    Connection pooling, N+1 prevention
    Select only needed fields
    Cursor-based pagination
`);
