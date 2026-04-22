// ============================================
// REACT STATE AND PROPS
// ============================================

// ---- 1. useState HOOK ----

const useStateExamples = `
import { useState } from 'react';

function Counter() {
  // useState returns [currentValue, setterFunction]
  const [count, setCount] = useState(0);  // 0 is initial value

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Multiple state variables
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      // Handle success...
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      <button disabled={isLoading}>{isLoading ? 'Loading...' : 'Login'}</button>
    </form>
  );
}
`;

// ---- 2. STATE WITH OBJECTS AND ARRAYS ----

const objectState = `
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    email: 'alice@test.com',
    preferences: { theme: 'light', lang: 'en' },
  });

  // WRONG — mutating state directly doesn't trigger re-render
  // user.name = 'Bob';

  // CORRECT — create new object with spread
  const updateName = (newName) => {
    setUser({ ...user, name: newName });
  };

  // Update nested object
  const updateTheme = (theme) => {
    setUser({
      ...user,
      preferences: { ...user.preferences, theme },
    });
  };

  return (
    <div>
      <p>{user.name} — {user.preferences.theme}</p>
      <button onClick={() => updateName('Bob')}>Change Name</button>
      <button onClick={() => updateTheme('dark')}>Dark Mode</button>
    </div>
  );
}

// State with arrays
function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', done: false },
    { id: 2, text: 'Build a project', done: false },
  ]);

  // Add item
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  };

  // Remove item
  const removeTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  // Toggle item
  const toggleTodo = (id) => {
    setTodos(todos.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Update item
  const updateTodo = (id, newText) => {
    setTodos(todos.map((t) => t.id === id ? { ...t, text: newText } : t));
  };

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
          <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => removeTodo(todo.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
`;

// ---- 3. UPDATER FUNCTION ----

const updaterFunction = `
function Counter() {
  const [count, setCount] = useState(0);

  // PROBLEM: batched updates — both use the same 'count'
  const incrementTwice = () => {
    setCount(count + 1);  // count = 0 → sets to 1
    setCount(count + 1);  // count = 0 → sets to 1 (NOT 2!)
  };

  // SOLUTION: use updater function (gets latest state)
  const incrementTwiceCorrect = () => {
    setCount((prev) => prev + 1);  // 0 → 1
    setCount((prev) => prev + 1);  // 1 → 2 ✓
  };

  return (
    <button onClick={incrementTwiceCorrect}>+2 (count: {count})</button>
  );
}

// Always use updater function when new state depends on previous state
`;

// ---- 4. LIFTING STATE UP ----

const liftingState = `
// When siblings need to share state, lift it to the parent

// Child components
function TemperatureInput({ scale, value, onChange }) {
  return (
    <fieldset>
      <legend>Temperature in {scale === 'c' ? 'Celsius' : 'Fahrenheit'}:</legend>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </fieldset>
  );
}

function BoilingVerdict({ celsius }) {
  if (celsius >= 100) return <p>The water would boil.</p>;
  return <p>The water would NOT boil.</p>;
}

// Parent owns the state
function Calculator() {
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');

  const toCelsius = (f) => ((f - 32) * 5) / 9;
  const toFahrenheit = (c) => (c * 9) / 5 + 32;

  const handleCelsiusChange = (value) => {
    setScale('c');
    setTemperature(value);
  };

  const handleFahrenheitChange = (value) => {
    setScale('f');
    setTemperature(value);
  };

  const celsius = scale === 'f' ? toCelsius(parseFloat(temperature)) : parseFloat(temperature);
  const fahrenheit = scale === 'c' ? toFahrenheit(parseFloat(temperature)) : parseFloat(temperature);

  return (
    <div>
      <TemperatureInput scale="c" value={scale === 'c' ? temperature : celsius.toFixed(1)} onChange={handleCelsiusChange} />
      <TemperatureInput scale="f" value={scale === 'f' ? temperature : fahrenheit.toFixed(1)} onChange={handleFahrenheitChange} />
      <BoilingVerdict celsius={celsius} />
    </div>
  );
}
`;

// ---- 5. CONTROLLED VS UNCONTROLLED COMPONENTS ----

const controlledVsUncontrolled = `
// CONTROLLED — React controls the value (recommended)
function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}                         // React controls the value
      onChange={(e) => setValue(e.target.value)} // Updates on every keystroke
    />
  );
}

// UNCONTROLLED — DOM controls the value (use ref)
import { useRef } from 'react';

function UncontrolledInput() {
  const inputRef = useRef(null);

  const handleSubmit = () => {
    console.log(inputRef.current.value);   // Read value from DOM
  };

  return (
    <>
      <input ref={inputRef} defaultValue="initial" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}

// Use controlled for: forms needing validation, dynamic UI
// Use uncontrolled for: file inputs, simple forms
`;

// ---- 6. DATA FLOW ----

const dataFlow = `
// React data flows ONE WAY: parent → child (via props)
// To communicate child → parent: pass callback functions as props

function Parent() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div>
      <ItemList onSelect={setSelectedItem} />    {/* child → parent via callback */}
      {selectedItem && <ItemDetail item={selectedItem} />}  {/* parent → child via props */}
    </div>
  );
}

function ItemList({ onSelect }) {
  const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} onClick={() => onSelect(item)}>{item.name}</li>
      ))}
    </ul>
  );
}

function ItemDetail({ item }) {
  return <div><h3>{item.name}</h3></div>;
}
`;

console.log("React State & Props complete!");
console.log("Key: useState, immutable updates, lifting state, controlled components");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Build a Todo app with add, toggle, delete, and edit functionality
// 2. Create a multi-step form where each step is a separate component
// 3. Implement a shopping cart with add/remove/update quantity (array state)
// 4. Build a temperature converter with lifted state
// 5. Create a controlled form with real-time validation
// 6. Explain when to lift state up vs use a state management library
