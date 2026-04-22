// ============================================
// REACT API INTEGRATION
// ============================================
// Fetching data, loading/error states, caching, patterns

// ---- 1. BASIC FETCH IN useEffect ----

const basicFetch = `
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch('/api/users', { signal: controller.signal });

        if (!res.ok) throw new Error(\`HTTP error: \${res.status}\`);

        const data = await res.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
    return () => controller.abort();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (users.length === 0) return <p>No users found</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} — {user.email}</li>
      ))}
    </ul>
  );
}
`;

// ---- 2. REUSABLE useFetch HOOK ----

const useFetchHook = `
import { useState, useEffect, useCallback } from 'react';

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || \`HTTP \${res.status}\`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [url]);

  useEffect(() => {
    const cleanup = fetchData();
    return () => cleanup?.then?.(fn => fn?.());
  }, [fetchData]);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
}

// Usage
function ProductList() {
  const { data: products, loading, error, refetch } = useFetch('/api/products');

  if (loading) return <p>Loading...</p>;
  if (error) return <button onClick={refetch}>Retry: {error}</button>;

  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
`;

// ---- 3. POST / MUTATION PATTERN ----

const mutationPattern = `
function useApiMutation(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (data, method = 'POST') => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || \`HTTP \${res.status}\`);
      }

      const result = await res.json();
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

// Usage
function CreateUserForm() {
  const { mutate, loading, error } = useApiMutation('/api/users');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await mutate({ name, email });
    if (result.success) {
      alert('User created!');
      setName('');
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
`;

// ---- 4. TANSTACK QUERY (React Query) ----

const tanstackQuery = `
// npm install @tanstack/react-query
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ===== Setup =====
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyApp />
    </QueryClientProvider>
  );
}

// ===== useQuery: Fetch Data =====
function UserList() {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,  // true during background refetch
  } = useQuery({
    queryKey: ['users'],            // cache key
    queryFn: () =>                  // fetcher function
      fetch('/api/users').then(res => res.json()),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      {isFetching && <p>Refreshing...</p>}
      {users.map(u => <UserCard key={u.id} user={u} />)}
    </div>
  );
}

// ===== useQuery with Parameters =====
function UserProfile({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['users', userId],    // unique cache per userId
    queryFn: () => fetch(\`/api/users/\${userId}\`).then(r => r.json()),
    enabled: !!userId,              // only fetch if userId exists
  });
}

// ===== useMutation: Create/Update/Delete =====
function CreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newUser) =>
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }).then(r => r.json()),

    onSuccess: () => {
      // Invalidate and refetch user list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ name: 'Alice', email: 'alice@test.com' });
  };

  return (
    <div>
      <button onClick={handleSubmit} disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create User'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </div>
  );
}
`;

// ---- 5. OPTIMISTIC UPDATES ----

const optimisticUpdates = `
// Update UI immediately, revert on error
const mutation = useMutation({
  mutationFn: (updatedTodo) =>
    fetch(\`/api/todos/\${updatedTodo.id}\`, {
      method: 'PATCH',
      body: JSON.stringify(updatedTodo),
    }),

  onMutate: async (updatedTodo) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos'] });

    // Save current state
    const previousTodos = queryClient.getQueryData(['todos']);

    // Optimistically update
    queryClient.setQueryData(['todos'], (old) =>
      old.map(t => t.id === updatedTodo.id ? updatedTodo : t)
    );

    return { previousTodos };  // context for onError
  },

  onError: (err, updatedTodo, context) => {
    // Revert on error
    queryClient.setQueryData(['todos'], context.previousTodos);
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
`;

// ---- 6. INFINITE SCROLL ----

const infiniteScroll = `
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useCallback } from 'react';

function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) =>
      fetch(\`/api/posts?page=\${pageParam}&limit=20\`).then(r => r.json()),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  // Intersection Observer for auto-loading
  const observer = useRef();
  const lastPostRef = useCallback(node => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  if (isLoading) return <Spinner />;

  const allPosts = data.pages.flatMap(page => page.posts);

  return (
    <div>
      {allPosts.map((post, i) => (
        <PostCard
          key={post.id}
          post={post}
          ref={i === allPosts.length - 1 ? lastPostRef : null}
        />
      ))}
      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
}
`;

// ---- SUMMARY ----
console.log("=== API Integration Summary ===");
console.log(`
  Patterns:
    Basic fetch + useEffect     — Simple cases
    Custom useFetch hook        — Reusable, medium apps
    TanStack Query (useQuery)   — Production apps (caching, refetch, devtools)

  Key Concepts:
    Loading states, error handling, abort controllers
    Cache invalidation, stale-while-revalidate
    Optimistic updates for snappy UX
    Infinite scroll with intersection observer
    Pagination (cursor vs offset)
`);
