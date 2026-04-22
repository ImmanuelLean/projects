// ============================================
// REACT FUNDAMENTALS
// ============================================
// React is a JavaScript library for building user interfaces.
// Setup: npm create vite@latest my-app -- --template react

// ---- 1. JSX ----

const jsxBasics = `
// JSX = JavaScript XML — HTML-like syntax in JavaScript
// JSX is transformed to React.createElement() calls by the build tool

// Basic component
function App() {
  const name = "Alice";
  const isLoggedIn = true;

  return (
    <div className="app">       {/* className, not class */}
      <h1>Hello, {name}!</h1>   {/* Expressions in curly braces */}

      {/* Conditional rendering */}
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in</p>}
      {isLoggedIn && <LogoutButton />}  {/* Short-circuit */}

      {/* Styles */}
      <p style={{ color: 'red', fontSize: '18px' }}>Inline styles use objects</p>

      {/* Lists — always use a unique key */}
      <ul>
        {['React', 'Vue', 'Angular'].map((fw) => (
          <li key={fw}>{fw}</li>
        ))}
      </ul>

      {/* Self-closing tags */}
      <img src="photo.jpg" alt="Photo" />
      <br />
    </div>
  );
}

export default App;
`;

// ---- 2. COMPONENTS ----

const components = `
// Function component (modern — always use these)
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Arrow function component
const Button = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button className={\`btn btn-\${variant}\`} onClick={onClick}>
      {label}
    </button>
  );
};

// Component composition
function App() {
  return (
    <div>
      <Header />
      <main>
        <Greeting name="Alice" />
        <Button label="Click me" onClick={() => alert('Clicked!')} />
      </main>
      <Footer />
    </div>
  );
}

// Children prop
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage:
// <Card title="My Card">
//   <p>This is the card content</p>
//   <Button label="Action" />
// </Card>
`;

// ---- 3. PROPS ----

const propsExample = `
// Props = data passed from parent to child (read-only)
function UserCard({ name, email, age, avatar, onEdit }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
      {age && <p>Age: {age}</p>}
      <button onClick={() => onEdit(name)}>Edit</button>
    </div>
  );
}

// Passing props
function App() {
  const handleEdit = (name) => console.log('Editing', name);

  return (
    <UserCard
      name="Alice"
      email="alice@test.com"
      age={28}
      avatar="/alice.jpg"
      onEdit={handleEdit}
    />
  );
}

// Spread props
function Input({ label, ...inputProps }) {
  return (
    <label>
      {label}
      <input {...inputProps} />
    </label>
  );
}
// <Input label="Email" type="email" placeholder="Enter email" required />

// Default props
function Badge({ text, color = 'blue', size = 'md' }) {
  return <span className={\`badge badge-\${color} badge-\${size}\`}>{text}</span>;
}
`;

// ---- 4. EVENT HANDLING ----

const events = `
function EventExamples() {
  // Click
  const handleClick = () => console.log('Clicked!');

  // With event object
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  // Passing arguments
  const handleDelete = (id) => {
    console.log('Deleting item', id);
  };

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <button onClick={() => handleDelete(42)}>Delete Item 42</button>

      <form onSubmit={handleSubmit}>
        <input type="text" onChange={(e) => console.log(e.target.value)} />
        <button type="submit">Submit</button>
      </form>

      <input
        onFocus={() => console.log('focused')}
        onBlur={() => console.log('blurred')}
        onKeyDown={(e) => e.key === 'Enter' && console.log('Enter pressed')}
      />
    </div>
  );
}
`;

// ---- 5. CONDITIONAL RENDERING ----

const conditionalRendering = `
function Dashboard({ user, notifications, isLoading, error }) {
  // Early return
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <LoginPrompt />;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>

      {/* Ternary */}
      {user.role === 'admin' ? <AdminPanel /> : <UserPanel />}

      {/* Short-circuit (render if truthy) */}
      {notifications.length > 0 && (
        <NotificationBadge count={notifications.length} />
      )}

      {/* Inline if-else with variable */}
      {(() => {
        switch (user.role) {
          case 'admin': return <AdminDashboard />;
          case 'moderator': return <ModDashboard />;
          default: return <UserDashboard />;
        }
      })()}
    </div>
  );
}
`;

// ---- 6. LISTS AND KEYS ----

const listsAndKeys = `
function TodoList({ todos }) {
  if (todos.length === 0) {
    return <p>No todos yet!</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        // Key must be unique and stable (NOT array index if list changes)
        <li key={todo.id} className={todo.done ? 'completed' : ''}>
          <span>{todo.text}</span>
          <span>{todo.done ? '✓' : '○'}</span>
        </li>
      ))}
    </ul>
  );
}

// Extracting list item into component
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={todo.done ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>×</button>
    </li>
  );
}

function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
`;

// ---- 7. FRAGMENTS ----

const fragments = `
import { Fragment } from 'react';

// Problem: components must return a single root element
// Solution: Fragment (doesn't add extra DOM nodes)

function UserInfo({ user }) {
  return (
    <>                     {/* Short syntax for Fragment */}
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </>
  );
}

// Long syntax (needed when using key)
function ItemList({ items }) {
  return items.map((item) => (
    <Fragment key={item.id}>
      <dt>{item.term}</dt>
      <dd>{item.definition}</dd>
    </Fragment>
  ));
}
`;

console.log("React Fundamentals complete!");
console.log("Key: JSX, components, props, events, conditional rendering, lists");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create a Card component that accepts title, content, and children props
// 2. Build a UserList that renders an array of users with proper keys
// 3. Create a Button component with variants (primary, secondary, danger)
// 4. Implement conditional rendering: loading → error → empty → data states
// 5. Build a simple navbar with active link highlighting
// 6. Create a reusable Input component that spreads remaining props
