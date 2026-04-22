// ============================================
// ZUSTAND & STATE MANAGEMENT ALTERNATIVES
// ============================================
// Lightweight state management solutions

// ---- 1. ZUSTAND ----
// npm install zustand

const zustandBasics = `
import { create } from 'zustand';

// ===== Basic Store =====
const useCounterStore = create((set, get) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  getDoubled: () => get().count * 2,
}));

// Usage — no Provider needed!
function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  return <button onClick={increment}>Count: {count}</button>;
}

// Or destructure multiple values
function CounterFull() {
  const { count, increment, decrement, reset } = useCounterStore();
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
`;

// ---- 2. ZUSTAND: REAL-WORLD EXAMPLE ----

const zustandRealWorld = `
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ===== Todo Store with Middleware =====
const useTodoStore = create(
  devtools(
    persist(
      (set, get) => ({
        todos: [],
        filter: 'all',

        // Actions
        addTodo: (text) =>
          set((state) => ({
            todos: [...state.todos, {
              id: Date.now(),
              text,
              completed: false,
              createdAt: new Date().toISOString(),
            }],
          }), false, 'addTodo'),  // action name for devtools

        toggleTodo: (id) =>
          set((state) => ({
            todos: state.todos.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t
            ),
          })),

        removeTodo: (id) =>
          set((state) => ({
            todos: state.todos.filter((t) => t.id !== id),
          })),

        setFilter: (filter) => set({ filter }),

        clearCompleted: () =>
          set((state) => ({
            todos: state.todos.filter((t) => !t.completed),
          })),

        // Computed values (use get())
        getFilteredTodos: () => {
          const { todos, filter } = get();
          switch (filter) {
            case 'active': return todos.filter((t) => !t.completed);
            case 'completed': return todos.filter((t) => t.completed);
            default: return todos;
          }
        },

        getStats: () => {
          const { todos } = get();
          return {
            total: todos.length,
            completed: todos.filter((t) => t.completed).length,
            active: todos.filter((t) => !t.completed).length,
          };
        },
      }),
      { name: 'todo-store' }  // localStorage key for persist
    ),
    { name: 'TodoStore' }     // devtools name
  )
);

// ===== Async Actions =====
const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      set({ users: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createUser: async (userData) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const newUser = await res.json();
      set((state) => ({ users: [...state.users, newUser] }));
      return newUser;
    } catch (err) {
      set({ error: err.message });
    }
  },
}));
`;

// ---- 3. ZUSTAND: SLICES PATTERN ----

const zustandSlices = `
// Split store into slices for large apps

const createAuthSlice = (set) => ({
  user: null,
  token: null,
  login: async (email, password) => {
    const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    const data = await res.json();
    set({ user: data.user, token: data.token });
  },
  logout: () => set({ user: null, token: null }),
});

const createCartSlice = (set) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
  getTotal: () => get().items.reduce((sum, i) => sum + i.price, 0),
});

const createUISlice = (set) => ({
  theme: 'dark',
  sidebarOpen: true,
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
});

// Combine slices
const useStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createCartSlice(...a),
  ...createUISlice(...a),
}));

// Usage
function Header() {
  const user = useStore((s) => s.user);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  // ...
}
`;

// ---- 4. JOTAI (Atomic State) ----

const jotaiExample = `
// npm install jotai
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

// ===== Atoms: smallest unit of state =====
const countAtom = atom(0);
const nameAtom = atom('Alice');
const darkModeAtom = atom(false);

// Derived atom (computed)
const doubledAtom = atom((get) => get(countAtom) * 2);

// Writable derived atom
const uppercaseNameAtom = atom(
  (get) => get(nameAtom).toUpperCase(),      // read
  (get, set, newName) => set(nameAtom, newName)  // write
);

// Async atom
const userAtom = atom(async () => {
  const res = await fetch('/api/user');
  return res.json();
});

// Usage
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const doubled = useAtomValue(doubledAtom);  // read-only
  const setName = useSetAtom(nameAtom);       // write-only

  return (
    <div>
      <p>Count: {count} (doubled: {doubled})</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}

// Benefits:
// - No Provider needed (optional)
// - Bottom-up approach (compose atoms)
// - Great for React Suspense
// - Tiny bundle size (~3KB)
`;

// ---- 5. COMPARISON TABLE ----

console.log("=== State Management Comparison ===");
console.log(`
  Feature          | Redux Toolkit | Zustand    | Jotai     | Context
  ─────────────────────────────────────────────────────────────────────
  Bundle Size      | ~11KB         | ~1KB       | ~3KB      | 0 (built-in)
  Boilerplate      | Medium        | Minimal    | Minimal   | Low
  Learning Curve   | Steep         | Easy       | Easy      | Easy
  DevTools         | Excellent     | Good       | Good      | None
  Provider Needed  | Yes           | No         | Optional  | Yes
  Async Support    | createAsyncThunk | Built-in | Atoms   | Manual
  Middleware       | Rich          | Available  | Limited   | None
  Persistence      | Manual/RTK    | Built-in   | Plugin    | Manual
  Best For         | Large apps    | Any size   | React-first| Simple

  Decision Guide:
    Small app, few shared states    → Context + useReducer
    Medium app, simple needs        → Zustand
    Atomic/granular state           → Jotai
    Large app, team conventions     → Redux Toolkit
    Heavy server state              → TanStack Query (with any above)
`);
