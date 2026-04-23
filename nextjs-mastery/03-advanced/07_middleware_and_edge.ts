// ============================================
// MIDDLEWARE, EDGE RUNTIME & ADVANCED PATTERNS
// ============================================

const middleware = `
// middleware.ts (root level — runs on EVERY request)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ===== Auth Protection =====
  const token = request.cookies.get('token')?.value;
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/settings');

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ===== Redirect =====
  if (pathname === '/old-page') {
    return NextResponse.redirect(new URL('/new-page', request.url));
  }

  // ===== Rewrite (URL stays same, content changes) =====
  if (pathname.startsWith('/blog') && request.headers.get('x-country') === 'FR') {
    return NextResponse.rewrite(new URL('/blog-fr' + pathname.slice(5), request.url));
  }

  // ===== Add Headers =====
  const response = NextResponse.next();
  response.headers.set('X-Request-Id', crypto.randomUUID());
  response.headers.set('X-Frame-Options', 'DENY');

  // ===== Rate Limiting Header =====
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  response.headers.set('X-Client-IP', ip);

  return response;
}

// Only run on specific paths
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
`;

const parallelRoutes = `
// ===== Parallel Routes (render multiple pages simultaneously) =====
// app/dashboard/@analytics/page.tsx
// app/dashboard/@notifications/page.tsx
// app/dashboard/layout.tsx

// layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">{children}</div>
      <div className="space-y-4">
        {analytics}
        {notifications}
      </div>
    </div>
  );
}
// Each slot loads independently with its own loading.tsx!
`;

const interceptingRoutes = `
// ===== Intercepting Routes (modals) =====
// Show a modal when clicking a link, full page on direct visit

// app/feed/page.tsx — list of posts
// app/feed/@modal/(.)post/[id]/page.tsx — intercepted: shows modal
// app/post/[id]/page.tsx — direct visit: full page

// The (.) means "intercept same level"
// (..) means "intercept one level up"
// (...) means "intercept from root"
`;

const deployment = `
// ===== Deployment =====

// Vercel (recommended — built by Next.js team)
// Just push to GitHub, Vercel auto-deploys

// Self-hosted
// npm run build
// npm start

// Docker
// FROM node:20-alpine
// WORKDIR /app
// COPY package*.json ./
// RUN npm ci
// COPY . .
// RUN npm run build
// ENV NODE_ENV=production
// EXPOSE 3000
// CMD ["npm", "start"]

// Environment variables
// .env.local (dev, not committed)
// Vercel dashboard (production)
// NEXT_PUBLIC_ prefix = exposed to browser
// Without prefix = server-only (safe for secrets)
`;

const fullExample = `
// ===== COMPLETE NEXT.JS APP STRUCTURE =====

app/
├── (auth)/                    # Route group (no URL segment)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx             # Auth layout (centered card)
│
├── (main)/                    # Route group
│   ├── layout.tsx             # Main layout (navbar + footer)
│   ├── page.tsx               # Home /
│   ├── about/page.tsx         # /about
│   │
│   ├── blog/
│   │   ├── page.tsx           # /blog (list)
│   │   └── [slug]/
│   │       ├── page.tsx       # /blog/:slug
│   │       └── loading.tsx
│   │
│   └── dashboard/
│       ├── layout.tsx         # Dashboard layout (sidebar)
│       ├── page.tsx           # /dashboard
│       ├── settings/page.tsx  # /dashboard/settings
│       └── @stats/            # Parallel route
│           └── page.tsx
│
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── users/route.ts
│   └── webhooks/stripe/route.ts
│
├── actions/                   # Server actions
│   ├── posts.ts
│   └── auth.ts
│
├── layout.tsx                 # Root layout
├── loading.tsx
├── error.tsx
├── not-found.tsx
└── globals.css

lib/
├── db.ts                      # Prisma client
├── auth.ts                    # NextAuth config
├── utils.ts                   # cn(), formatDate, etc.
└── validators.ts              # Zod schemas

components/
├── ui/                        # Generic UI (Button, Card, Modal)
├── forms/                     # Form components
├── layout/                    # Navbar, Sidebar, Footer
└── features/                  # Feature-specific components
`;

console.log("=== Next.js Advanced Patterns ===");
console.log("Middleware, parallel routes, intercepting routes, deployment");
console.log("\\nNext.js Mastery curriculum complete!");

export {};
