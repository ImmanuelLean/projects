// ============================================
// SERVER vs CLIENT COMPONENTS
// ============================================
// The most important concept in Next.js App Router

// ---- 1. THE RULE ----

const theRule = `
  ┌─────────────────────────────────────────────────────┐
  │  ALL components are SERVER components by default     │
  │  Add 'use client' at top of file for client features │
  └─────────────────────────────────────────────────────┘

  Server Component (default):
    ✅ Fetch data directly (async/await)
    ✅ Access backend (DB, files, env vars)
    ✅ Zero JS sent to browser (smaller bundle)
    ✅ SEO-friendly (rendered on server)
    ❌ No useState, useEffect, onClick, browser APIs

  Client Component ('use client'):
    ✅ useState, useEffect, useRef
    ✅ onClick, onChange, onSubmit
    ✅ Browser APIs (localStorage, window)
    ✅ Third-party hooks (useQuery, useForm)
    ❌ Can't be async
    ❌ Adds JS to browser bundle
`;

// ---- 2. SERVER COMPONENT (default) ----

const serverComponent = `
// app/users/page.tsx — NO 'use client' = server component
import { prisma } from '@/lib/db';

export default async function UsersPage() {
  // Direct database access — runs on server only!
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <ul className="space-y-4">
        {users.map(user => (
          <li key={user.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ===== Fetch from external API =====
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // cache for 1 hour
  });
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductList products={products} />;
}
`;

// ---- 3. CLIENT COMPONENT ----

const clientComponent = `
// components/SearchBar.tsx
'use client';  // ← This makes it a client component

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(\`/search?q=\${encodeURIComponent(query)}\`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="border rounded-lg px-4 py-2 flex-1"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Search
      </button>
    </form>
  );
}
`;

// ---- 4. MIXING SERVER & CLIENT ----

const mixing = `
  PATTERN: Server components can import client components
           Client components CANNOT import server components

  ✅ CORRECT:
  // app/page.tsx (server)
  import SearchBar from '@/components/SearchBar'; // client component
  import { prisma } from '@/lib/db';

  export default async function Page() {
    const posts = await prisma.post.findMany();  // server-side fetch
    return (
      <div>
        <SearchBar />          {/* client: has useState */}
        <PostList posts={posts} /> {/* server: just renders data */}
      </div>
    );
  }

  ❌ WRONG:
  // components/ClientComp.tsx
  'use client';
  import ServerComp from './ServerComp'; // ❌ Can't import server into client

  ✅ SOLUTION: Pass as children
  // app/page.tsx (server)
  export default async function Page() {
    return (
      <ClientWrapper>
        <ServerComponent />  {/* passed as children prop */}
      </ClientWrapper>
    );
  }
`;

// ---- 5. WHEN TO USE WHICH ----

const decisionGuide = `
  USE SERVER COMPONENT (default):
    - Fetching data
    - Accessing database
    - Displaying static content
    - Rendering lists of items
    - SEO-important pages
    - Components with no interactivity

  USE CLIENT COMPONENT ('use client'):
    - Forms with state (useState)
    - Click handlers (onClick)
    - Effects (useEffect)
    - Browser APIs (localStorage, navigator)
    - Hooks from libraries (useQuery, useForm)
    - Interactive widgets (modals, dropdowns, tabs)
    - Real-time updates

  RULE OF THUMB:
    Keep 'use client' as DEEP as possible in the component tree.
    Only the interactive LEAF components should be client components.

    ✅ Page (server) → Layout (server) → Card (server) → LikeButton (client)
    ❌ Page (client) — makes entire page client-side
`;

// ---- 6. DATA FLOW PATTERN ----

const dataFlow = `
// ===== Best pattern: Fetch in server, pass to client =====

// app/products/page.tsx (SERVER)
import { prisma } from '@/lib/db';
import ProductGrid from '@/components/ProductGrid';

export default async function ProductsPage() {
  // Fetch on server (no API call, direct DB access)
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });

  // Pass serializable data to client component
  return <ProductGrid products={products} />;
}

// components/ProductGrid.tsx (CLIENT)
'use client';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  return (
    <div>
      <select value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="books">Books</option>
      </select>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {filtered.map(p => (
          <div key={p.id} className="border rounded p-4">
            <h3>{p.name}</h3>
            <p>\${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

console.log("=== Server vs Client Components ===");
console.log("Default = Server | 'use client' = Client | Keep client boundary deep");

export {};
