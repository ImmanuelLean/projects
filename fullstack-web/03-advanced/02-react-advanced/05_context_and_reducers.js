// ============================================
// REACT CONTEXT & useReducer
// ============================================
// Global state without prop drilling

// ---- 1. THE PROBLEM: PROP DRILLING ----

const propDrillingProblem = `
// Passing props through many levels is tedious and fragile

function App() {
  const [user, setUser] = useState({ name: 'Alice', theme: 'dark' });
  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  // Layout doesn't use user, just passes it down
  return <Sidebar user={user} setUser={setUser} />;
}

function Sidebar({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />;
}

function UserMenu({ user, setUser }) {
  // Finally uses user!
  return <p>Hello, {user.name}</p>;
}
// 😩 Every component in between must pass user/setUser
`;

// ---- 2. createContext + useContext ----

const contextBasics = `
import { createContext, useContext, useState } from 'react';

// ===== Step 1: Create context =====
const ThemeContext = createContext(null);

// ===== Step 2: Create Provider =====
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ===== Step 3: Custom hook for consuming =====
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ===== Step 4: Use anywhere in the tree =====
function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}

function Layout() {
  return <Sidebar />;  // no prop passing needed!
}

function Sidebar() {
  return <ThemeToggle />;
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
`;

// ---- 3. AUTH CONTEXT (Real-World) ----

const authContext = `
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/me', {
        headers: { Authorization: \`Bearer \${token}\` }
      })
        .then(res => res.json())
        .then(user => setUser(user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.message };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be within AuthProvider');
  return context;
}

// Usage
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
`;

// ---- 4. useReducer ----

const useReducerBasics = `
import { useReducer } from 'react';

// ===== useReducer: Complex state logic =====
// Better than useState when:
// - Multiple related state values
// - Next state depends on previous state
// - Complex state transitions

// Step 1: Define initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  filter: 'all',
};

// Step 2: Define action types
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_ITEM: 'ADD_ITEM',
  DELETE_ITEM: 'DELETE_ITEM',
  TOGGLE_ITEM: 'TOGGLE_ITEM',
  SET_FILTER: 'SET_FILTER',
};

// Step 3: Define reducer function
function todoReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };

    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, items: action.payload };

    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };

    case ACTIONS.ADD_ITEM:
      return {
        ...state,
        items: [...state.items, {
          id: Date.now(),
          text: action.payload,
          completed: false,
        }],
      };

    case ACTIONS.DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case ACTIONS.TOGGLE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, completed: !item.completed }
            : item
        ),
      };

    case ACTIONS.SET_FILTER:
      return { ...state, filter: action.payload };

    default:
      throw new Error(\`Unknown action: \${action.type}\`);
  }
}

// Step 4: Use in component
function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const addTodo = (text) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: text });
  };

  const deleteTodo = (id) => {
    dispatch({ type: ACTIONS.DELETE_ITEM, payload: id });
  };

  const toggleTodo = (id) => {
    dispatch({ type: ACTIONS.TOGGLE_ITEM, payload: id });
  };

  const filteredItems = state.items.filter(item => {
    if (state.filter === 'active') return !item.completed;
    if (state.filter === 'completed') return item.completed;
    return true;
  });

  return (
    <div>
      <TodoForm onSubmit={addTodo} />
      <TodoFilter
        filter={state.filter}
        onFilter={(f) => dispatch({ type: ACTIONS.SET_FILTER, payload: f })}
      />
      <TodoList
        items={filteredItems}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}
`;

// ---- 5. CONTEXT + REDUCER (Mini Redux) ----

const contextPlusReducer = `
import { createContext, useContext, useReducer } from 'react';

// ===== Combine Context + Reducer for global state management =====

// State
const initialCartState = {
  items: [],
  total: 0,
};

// Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(i => i.id === action.payload.id);
      let items;
      if (existing) {
        items = state.items.map(i =>
          i.id === action.payload.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        items = [...state.items, { ...action.payload, quantity: 1 }];
      }
      return { items, total: items.reduce((s, i) => s + i.price * i.quantity, 0) };
    }

    case 'REMOVE_FROM_CART': {
      const items = state.items.filter(i => i.id !== action.payload);
      return { items, total: items.reduce((s, i) => s + i.price * i.quantity, 0) };
    }

    case 'CLEAR_CART':
      return initialCartState;

    default:
      return state;
  }
}

// Context
const CartContext = createContext(null);

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const addToCart = (product) =>
    dispatch({ type: 'ADD_TO_CART', payload: product });
  const removeFromCart = (id) =>
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  const clearCart = () =>
    dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{
      items: state.items,
      total: state.total,
      addToCart,
      removeFromCart,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be within CartProvider');
  return context;
}

// Usage
function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <div>
      <h3>{product.name} - \${product.price}</h3>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}

function CartSummary() {
  const { items, total, clearCart } = useCart();
  return (
    <div>
      <p>{items.length} items — Total: \${total.toFixed(2)}</p>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
`;

// ---- 6. WHEN TO USE WHAT ----

console.log("=== Context & Reducers Summary ===");
console.log(`
  useState:
    Simple, independent state values
    Toggles, form fields, counters

  useReducer:
    Complex state objects
    Multiple related values
    State transitions with business logic

  Context:
    Theme, auth, locale, cart
    Data needed by many components
    Avoid excessive prop drilling

  Context + Reducer:
    Complex global state (mini Redux)
    Good for medium apps

  External State Manager (Redux/Zustand):
    Very large apps
    Complex async logic
    Time-travel debugging needed
    Team conventions
`);
