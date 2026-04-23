// ============================================
// TYPESCRIPT WITH REACT
// ============================================
// npx create-vite my-app --template react-ts

// ===== COMPONENT PROPS =====

const componentProps = `
import { ReactNode, CSSProperties } from 'react';

// Basic props interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function Button({ label, onClick, variant = 'primary', disabled, icon, className }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={\`btn btn-\${variant} \${className}\`}>
      {icon && <span className="icon">{icon}</span>}
      {label}
    </button>
  );
}

// Children prop
interface CardProps {
  title: string;
  children: ReactNode;          // any valid JSX
  footer?: ReactNode;
}

function Card({ title, children, footer }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  );
}

// PropsWithChildren shortcut
import { PropsWithChildren } from 'react';

type LayoutProps = PropsWithChildren<{
  sidebar?: ReactNode;
}>;

function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div className="layout">
      {sidebar && <aside>{sidebar}</aside>}
      <main>{children}</main>
    </div>
  );
}
`;

// ===== EVENT HANDLERS =====

const eventHandlers = `
import { ChangeEvent, FormEvent, MouseEvent, KeyboardEvent } from 'react';

function Form() {
  // Input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);  // string
  };

  // Select change
  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
  };

  // Form submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
  };

  // Click with element type
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log(e.clientX, e.clientY);
  };

  // Keyboard
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // submit
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} onKeyDown={handleKeyDown} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
`;

// ===== HOOKS WITH TYPES =====

const typedHooks = `
import { useState, useEffect, useRef, useReducer, useCallback, useMemo } from 'react';

// useState — type is inferred or explicit
function Profile() {
  const [name, setName] = useState('');           // string (inferred)
  const [age, setAge] = useState<number | null>(null); // explicit for null
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  // useRef — typed ref
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // useEffect — return cleanup or void
  useEffect(() => {
    const timer = setInterval(() => {}, 1000);
    timerRef.current = timer;
    return () => clearInterval(timer);
  }, []);

  // useMemo & useCallback — types inferred
  const expensiveValue = useMemo(() => items.filter(i => i.active), [items]);
  const handleClick = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);
}

// ===== useReducer =====
interface State {
  count: number;
  error: string | null;
  loading: boolean;
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset'; payload: number }
  | { type: 'setError'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + 1 };
    case 'decrement': return { ...state, count: state.count - 1 };
    case 'reset': return { ...state, count: action.payload };
    case 'setError': return { ...state, error: action.payload };
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, error: null, loading: false });
  dispatch({ type: 'increment' });
  dispatch({ type: 'reset', payload: 10 });
  // dispatch({ type: 'unknown' }); // ❌ Type error!
}
`;

// ===== GENERIC COMPONENTS =====

const genericComponents = `
// Generic list component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

function List<T>({ items, renderItem, keyExtractor, emptyMessage }: ListProps<T>) {
  if (items.length === 0) return <p>{emptyMessage || 'No items'}</p>;
  return (
    <ul>
      {items.map((item, i) => (
        <li key={keyExtractor(item)}>{renderItem(item, i)}</li>
      ))}
    </ul>
  );
}

// Usage — T is inferred from items
<List
  items={users}
  keyExtractor={(user) => user.id}
  renderItem={(user) => <span>{user.name}</span>}
/>

// Generic select component
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
}

function Select<T>({ options, value, onChange, getLabel, getValue }: SelectProps<T>) {
  return (
    <select
      value={getValue(value)}
      onChange={(e) => {
        const selected = options.find(o => getValue(o) === e.target.value);
        if (selected) onChange(selected);
      }}
    >
      {options.map(option => (
        <option key={getValue(option)} value={getValue(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}
`;

// ===== CONTEXT WITH TYPES =====

const typedContext = `
import { createContext, useContext } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
`;

// ===== POLYMORPHIC COMPONENTS =====

const polymorphicComponent = `
// Component that can render as any HTML element
type PolymorphicProps<E extends React.ElementType> = {
  as?: E;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'children'>;

function Box<E extends React.ElementType = 'div'>({
  as,
  children,
  ...props
}: PolymorphicProps<E>) {
  const Component = as || 'div';
  return <Component {...props}>{children}</Component>;
}

// Usage
<Box>Default div</Box>
<Box as="section" id="main">Section</Box>
<Box as="a" href="/home">Link</Box>
<Box as="button" onClick={() => {}}>Button</Box>
`;

// ===== DISCRIMINATED UNION PROPS =====

const discriminatedProps = `
// Props that change shape based on a variant
type NotificationProps =
  | { variant: 'success'; message: string }
  | { variant: 'error'; message: string; retry: () => void }
  | { variant: 'loading' };

function Notification(props: NotificationProps) {
  switch (props.variant) {
    case 'success':
      return <div className="success">{props.message}</div>;
    case 'error':
      return (
        <div className="error">
          {props.message}
          <button onClick={props.retry}>Retry</button>
        </div>
      );
    case 'loading':
      return <div className="loading">Loading...</div>;
  }
}

// Usage
<Notification variant="success" message="Done!" />
<Notification variant="error" message="Failed" retry={() => {}} />
<Notification variant="loading" />
// <Notification variant="error" message="Oops" /> // ❌ Missing retry!
`;

console.log("=== TypeScript + React Patterns ===");
console.log("Component props, events, hooks, generics, context, polymorphic components");

export {};
