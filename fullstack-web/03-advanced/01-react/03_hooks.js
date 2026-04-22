// ============================================
// REACT HOOKS — COMPLETE GUIDE
// ============================================
// All built-in hooks + custom hooks
// Reference: https://react.dev/reference/react/hooks

// ---- 1. useState (Recap) ----

const useStateBasics = `
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // Functional update: use when new state depends on previous
  const increment = () => setCount(prev => prev + 1);

  // Lazy initial state (expensive computation runs only once)
  const [data, setData] = useState(() => {
    return computeExpensiveValue();
  });

  return <button onClick={increment}>Count: {count}</button>;
}
`;

// ---- 2. useEffect (Lifecycle Management) ----

const useEffectExamples = `
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== MOUNT: Run once on component mount =====
  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');  // cleanup
  }, []);  // empty dependency array = mount only

  // ===== UPDATE: Run when dependency changes =====
  useEffect(() => {
    setLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });

    // Cleanup: cancel if userId changes before fetch completes
    return () => {
      // cleanup runs before next effect or unmount
    };
  }, [userId]);  // re-runs when userId changes

  // ===== EVERY RENDER: No dependency array =====
  useEffect(() => {
    document.title = \`User: \${user?.name || 'Loading'}\`;
  });  // runs after every render

  if (loading) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}

// ===== CLEANUP PATTERNS =====
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);  // cleanup on unmount
  }, []);

  return <p>Elapsed: {seconds}s</p>;
}

// ===== ABORT CONTROLLER (Cancel fetch) =====
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(\`/api/search?q=\${query}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => {
        if (err.name !== 'AbortError') throw err;
      });

    return () => controller.abort();  // cancel on re-render
  }, [query]);

  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>;
}
`;

// ---- 3. useRef ----

const useRefExamples = `
import { useRef, useEffect, useState } from 'react';

// ===== DOM REFERENCE =====
function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();  // direct DOM access
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Click button to focus" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

// ===== MUTABLE VALUE (persists across renders, no re-render on change) =====
function StopWatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);  // persists without causing re-render

  const start = () => {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTime(prev => prev + 10);
    }, 10);
  };

  const stop = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  return (
    <div>
      <p>{(time / 1000).toFixed(2)}s</p>
      <button onClick={running ? stop : start}>
        {running ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}

// ===== PREVIOUS VALUE =====
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);

  useEffect(() => {
    prevCountRef.current = count;
  });

  return (
    <p>Now: {count}, Previously: {prevCountRef.current}</p>
  );
}

// ===== RENDER COUNT =====
function RenderTracker() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  return <p>Renders: {renderCount.current}</p>;
}
`;

// ---- 4. useMemo & useCallback ----

const memoExamples = `
import { useMemo, useCallback, useState } from 'react';

// ===== useMemo: Memoize a COMPUTED VALUE =====
function ExpensiveList({ items, filter }) {
  // Only recomputes when items or filter changes
  const filteredItems = useMemo(() => {
    console.log('Filtering... (expensive)');
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return <ul>{filteredItems.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}

// ===== useCallback: Memoize a FUNCTION =====
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // Without useCallback, handleClick is recreated every render
  // causing ChildComponent to re-render unnecessarily
  const handleClick = useCallback(() => {
    console.log('Clicked!', count);
  }, [count]);  // only recreate when count changes

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ChildComponent onClick={handleClick} />
    </div>
  );
}

// ===== WHEN TO USE =====
// useMemo:  expensive calculations, derived data, referential equality
// useCallback: passing callbacks to optimized child components (React.memo)
// DON'T overuse — premature optimization adds complexity
`;

// ---- 5. useId ----

const useIdExample = `
import { useId } from 'react';

function FormField({ label, type = 'text' }) {
  const id = useId();  // generates unique ID, SSR-safe

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} />
    </div>
  );
}

// Multiple IDs from one useId
function PasswordField() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id + '-input'}>Password</label>
      <input id={id + '-input'} type="password" aria-describedby={id + '-hint'} />
      <p id={id + '-hint'}>Must be 8+ characters</p>
    </div>
  );
}
`;

// ---- 6. CUSTOM HOOKS ----

const customHooks = `
import { useState, useEffect, useRef, useCallback } from 'react';

// ===== useLocalStorage =====
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
// Usage: const [theme, setTheme] = useLocalStorage('theme', 'dark');

// ===== useFetch =====
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json();
      })
      .then(data => { setData(data); setError(null); })
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
// Usage: const { data, loading, error } = useFetch('/api/users');

// ===== useDebounce =====
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
// Usage: const debouncedSearch = useDebounce(searchTerm, 500);

// ===== useToggle =====
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return { value, toggle, setTrue, setFalse };
}
// Usage: const { value: isOpen, toggle } = useToggle();

// ===== useClickOutside =====
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}
// Usage:
// const dropdownRef = useRef();
// useClickOutside(dropdownRef, () => setOpen(false));

// ===== useMediaQuery =====
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
// Usage: const isMobile = useMediaQuery('(max-width: 768px)');

// ===== usePrevious =====
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}
// Usage: const prevCount = usePrevious(count);

// ===== useWindowSize =====
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
// Usage: const { width, height } = useWindowSize();
`;

// ---- 7. RULES OF HOOKS ----

const rulesOfHooks = `
// ===== RULES =====
// 1. Only call hooks at the TOP LEVEL (not inside loops, conditions, nested functions)
// 2. Only call hooks from React FUNCTION COMPONENTS or custom hooks
// 3. Custom hooks must start with "use" prefix

// ❌ WRONG
function Bad({ show }) {
  if (show) {
    const [val, setVal] = useState(0);  // conditional hook!
  }
}

// ✅ CORRECT
function Good({ show }) {
  const [val, setVal] = useState(0);  // always called
  if (show) {
    // use val here
  }
}
`;

// ---- SUMMARY ----
console.log("=== React Hooks Summary ===");
console.log(`
  Built-in Hooks:
    useState      — State management
    useEffect     — Side effects (fetch, subscriptions, DOM)
    useRef        — Mutable ref / DOM access
    useMemo       — Memoize computed values
    useCallback   — Memoize functions
    useId         — Generate unique IDs
    useContext    — Access context (see context lesson)
    useReducer   — Complex state logic (see context lesson)

  Custom Hook Pattern:
    - Extract reusable logic from components
    - Must start with "use" prefix
    - Can call other hooks
    - Share stateful logic, NOT state itself

  Common Custom Hooks:
    useLocalStorage, useFetch, useDebounce,
    useToggle, useClickOutside, useMediaQuery,
    usePrevious, useWindowSize
`);
