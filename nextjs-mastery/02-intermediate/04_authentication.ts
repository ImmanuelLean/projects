// ============================================
// NEXT.JS AUTHENTICATION (NextAuth.js / Auth.js)
// ============================================
// npm install next-auth @auth/prisma-adapter

const setup = `
// lib/auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db';
import bcrypt from 'bcrypt';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! }),
    Google({ clientId: process.env.GOOGLE_ID!, clientSecret: process.env.GOOGLE_SECRET! }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.password);
        return valid ? user : null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
  },
});

// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
`;

const protectedPages = `
// ===== Server-side auth check =====
// app/dashboard/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}

// ===== Middleware (protect entire routes) =====
// middleware.ts (root level)
import { auth } from '@/lib/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/api/protected/:path*'],
};

// ===== Client-side auth =====
// components/UserMenu.tsx
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  if (!session) {
    return (
      <div className="flex gap-2">
        <button onClick={() => signIn('github')} className="bg-gray-900 text-white px-4 py-2 rounded">
          Sign in with GitHub
        </button>
        <button onClick={() => signIn('google')} className="bg-blue-600 text-white px-4 py-2 rounded">
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <img src={session.user?.image || ''} className="w-8 h-8 rounded-full" />
      <span>{session.user?.name}</span>
      <button onClick={() => signOut()} className="text-red-600">Sign Out</button>
    </div>
  );
}

// Wrap app in SessionProvider
// app/providers.tsx
'use client';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// app/layout.tsx
import Providers from './providers';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html><body><Providers>{children}</Providers></body></html>
  );
}
`;

console.log("=== Next.js Authentication ===");
console.log("NextAuth.js, OAuth providers, credentials, middleware, session");

export {};
