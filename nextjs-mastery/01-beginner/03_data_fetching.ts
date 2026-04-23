// ============================================
// DATA FETCHING IN NEXT.JS
// ============================================

// ---- 1. SERVER COMPONENT FETCHING ----

const serverFetching = `
// ===== Direct async/await in server components =====

// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache',  // default: cache forever (SSG)
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// ===== CACHING OPTIONS =====

// Static (cached forever) — default
fetch(url);
fetch(url, { cache: 'force-cache' });

// Revalidate every N seconds (ISR)
fetch(url, { next: { revalidate: 3600 } }); // refresh every hour

// Dynamic (never cache)
fetch(url, { cache: 'no-store' });

// Page-level revalidation
export const revalidate = 60; // entire page revalidates every 60s

// Force dynamic rendering
export const dynamic = 'force-dynamic';
`;

// ---- 2. DATABASE FETCHING ----

const dbFetching = `
// ===== Direct database access (no API needed!) =====

// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// app/users/page.tsx
import { prisma } from '@/lib/db';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div>
      <h1>Users ({users.length})</h1>
      {users.map(user => (
        <div key={user.id}>{user.name} — {user.email}</div>
      ))}
    </div>
  );
}
`;

// ---- 3. PARALLEL & SEQUENTIAL FETCHING ----

const parallelFetching = `
// ===== PARALLEL: Faster — fetch at the same time =====
export default async function DashboardPage() {
  // Start both fetches simultaneously
  const [users, posts, stats] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    getStats(),
  ]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard label="Users" value={users} />
      <StatCard label="Posts" value={posts} />
      <StatCard label="Revenue" value={stats.revenue} />
    </div>
  );
}

// ===== SEQUENTIAL: When one depends on another =====
export default async function UserPostsPage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({ where: { id: Number(params.id) } });
  if (!user) notFound();

  // Needs user.id from above
  const posts = await prisma.post.findMany({ where: { authorId: user.id } });

  return <div>{user.name}'s posts: {posts.length}</div>;
}
`;

// ---- 4. ROUTE HANDLERS (API ROUTES) ----

const routeHandlers = `
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/users
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;

  const users = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users);
}

// POST /api/users
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email } = body;

  if (!name || !email) {
    return NextResponse.json(
      { error: 'Name and email required' },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({ data: { name, email } });
  return NextResponse.json(user, { status: 201 });
}

// app/api/users/[id]/route.ts
// GET /api/users/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
  });

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

// DELETE /api/users/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.user.delete({ where: { id: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
`;

// ---- 5. SERVER ACTIONS ----

const serverActions = `
// ===== Server Actions: Mutate data without API routes =====
// Functions that run on the server, called from client

// app/actions.ts
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !content) {
    return { error: 'Title and content required' };
  }

  await prisma.post.create({
    data: { title, content, authorId: 1 },
  });

  revalidatePath('/posts');  // refresh the posts page cache
  redirect('/posts');        // redirect after success
}

export async function deletePost(id: number) {
  await prisma.post.delete({ where: { id } });
  revalidatePath('/posts');
}

export async function toggleLike(postId: number) {
  // toggle like logic...
  revalidatePath(\`/posts/\${postId}\`);
}

// ===== Using in a form (Server Component) =====
// app/posts/new/page.tsx
import { createPost } from '@/app/actions';

export default function NewPostPage() {
  return (
    <form action={createPost} className="space-y-4 max-w-lg mx-auto">
      <input name="title" placeholder="Title" className="w-full border rounded p-2" required />
      <textarea name="content" placeholder="Content" className="w-full border rounded p-2 h-32" required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Publish
      </button>
    </form>
  );
}

// ===== Using in a Client Component =====
'use client';
import { deletePost } from '@/app/actions';
import { useTransition } from 'react';

function DeleteButton({ postId }: { postId: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => deletePost(postId))}
      disabled={isPending}
      className="text-red-600 hover:text-red-800"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
`;

// ---- 6. METADATA & SEO ----

const metadata = `
// ===== Static Metadata =====
// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | My App',
  description: 'Welcome to my app',
  openGraph: {
    title: 'My App',
    description: 'Welcome to my app',
    images: ['/og-image.jpg'],
  },
};

// ===== Dynamic Metadata =====
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.coverImage] },
  };
}
`;

console.log("=== Next.js Data Fetching ===");
console.log("Server components, caching, route handlers, server actions, SEO");

export {};
