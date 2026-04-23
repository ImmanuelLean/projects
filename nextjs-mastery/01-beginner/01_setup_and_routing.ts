// ============================================
// NEXT.JS: SETUP & APP ROUTER
// ============================================
// npx create-next-app@latest my-app --typescript --tailwind --app --eslint
// Docs: https://nextjs.org/docs

// ---- 1. PROJECT STRUCTURE ----

const structure = `
my-app/
├── app/                        ← App Router (Next.js 13+)
│   ├── layout.tsx              ← Root layout (wraps ALL pages)
│   ├── page.tsx                ← Home page (/)
│   ├── loading.tsx             ← Loading UI
│   ├── error.tsx               ← Error boundary
│   ├── not-found.tsx           ← 404 page
│   ├── globals.css
│   │
│   ├── about/
│   │   └── page.tsx            ← /about
│   │
│   ├── blog/
│   │   ├── page.tsx            ← /blog
│   │   └── [slug]/
│   │       └── page.tsx        ← /blog/my-post (dynamic route)
│   │
│   ├── dashboard/
│   │   ├── layout.tsx          ← Dashboard layout (nested)
│   │   ├── page.tsx            ← /dashboard
│   │   ├── settings/
│   │   │   └── page.tsx        ← /dashboard/settings
│   │   └── analytics/
│   │       └── page.tsx        ← /dashboard/analytics
│   │
│   └── api/                    ← API routes (Route Handlers)
│       ├── users/
│       │   └── route.ts        ← GET/POST /api/users
│       └── auth/
│           └── route.ts        ← /api/auth
│
├── components/                 ← Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Card.tsx
│
├── lib/                        ← Utilities, DB, auth
│   ├── db.ts
│   ├── auth.ts
│   └── utils.ts
│
├── public/                     ← Static files (images, fonts)
│   └── images/
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
`;

// ---- 2. ROOT LAYOUT ----

const rootLayout = `
// app/layout.tsx — wraps every page
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-900 text-white py-8">
          <p className="text-center">© 2025 My App</p>
        </footer>
      </body>
    </html>
  );
}
`;

// ---- 3. PAGES ----

const pages = `
// app/page.tsx — Home page (/)
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold mb-4">Welcome to My App</h1>
      <p className="text-xl text-gray-600">Built with Next.js 14</p>
    </div>
  );
}

// app/about/page.tsx — About page (/about)
export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">About Us</h1>
    </div>
  );
}
`;

// ---- 4. DYNAMIC ROUTES ----

const dynamicRoutes = `
// app/blog/[slug]/page.tsx — Dynamic route
interface Props {
  params: { slug: string };
}

export default function BlogPost({ params }: Props) {
  return <h1>Post: {params.slug}</h1>;
}

// Generate static pages at build time
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

// ===== Catch-all routes =====
// app/docs/[...slug]/page.tsx
// Matches: /docs/a, /docs/a/b, /docs/a/b/c
interface DocsProps {
  params: { slug: string[] };
}
export default function DocsPage({ params }: DocsProps) {
  // params.slug = ['a', 'b', 'c'] for /docs/a/b/c
  return <h1>Docs: {params.slug.join(' / ')}</h1>;
}

// ===== Optional catch-all =====
// app/shop/[[...slug]]/page.tsx
// Also matches: /shop (without any slug)
`;

// ---- 5. NESTED LAYOUTS ----

const nestedLayouts = `
// app/dashboard/layout.tsx — only wraps dashboard pages
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

// app/dashboard/page.tsx
export default function Dashboard() {
  return <h1>Dashboard Home</h1>;
}

// app/dashboard/settings/page.tsx
export default function Settings() {
  return <h1>Settings</h1>; // Sidebar is automatically included
}
`;

// ---- 6. NAVIGATION ----

const navigation = `
// components/Navbar.tsx
'use client';  // needed for hooks

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center gap-8">
        <Link href="/" className="text-xl font-bold">Logo</Link>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={\`\${
              pathname === link.href
                ? 'text-blue-600 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }\`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

// ===== Programmatic Navigation =====
'use client';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const router = useRouter();

  const handleSubmit = async () => {
    await login();
    router.push('/dashboard');    // navigate
    router.replace('/dashboard'); // replace (no back)
    router.back();                // go back
    router.refresh();             // refresh server components
  };
}
`;

// ---- 7. SPECIAL FILES ----

const specialFiles = `
// app/loading.tsx — shown while page loads
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );
}

// app/error.tsx — error boundary
'use client';
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
      <p className="text-gray-600 mt-2">{error.message}</p>
      <button onClick={reset} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Try again
      </button>
    </div>
  );
}

// app/not-found.tsx — 404 page
import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <Link href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded">
        Go Home
      </Link>
    </div>
  );
}
`;

console.log("=== Next.js Setup & Routing ===");
console.log("App Router, layouts, dynamic routes, navigation, special files");

export {};
