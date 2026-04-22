// ============================================
// ARROW FUNCTIONS, DESTRUCTURING & SPREAD
// ============================================

// ---- 1. ARROW FUNCTION SYNTAX ----

// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function equivalents
const add1 = (a, b) => { return a + b; };  // Full syntax
const add2 = (a, b) => a + b;              // Implicit return (single expression)
const double = (n) => n * 2;               // Single param (parens optional)
const greet = () => "Hello!";              // No params

// Multi-line arrow function (needs explicit return)
const processUser = (user) => {
  const name = user.name.toUpperCase();
  const age = user.age;
  return { name, age, processed: true };
};

// Returning an object literal (wrap in parentheses)
const makeUser = (name, age) => ({ name, age, active: true });
console.log(makeUser("Alice", 25));

// ---- 2. ARROW FUNCTIONS AND `this` ----

// Arrow functions DON'T have their own `this` — they inherit from outer scope

const timer = {
  seconds: 0,
  start() {
    // Regular function: `this` would be window/undefined in setInterval
    // Arrow function: `this` is inherited from start() → the timer object
    setInterval(() => {
      this.seconds++;
      // console.log(this.seconds); // Works! this = timer
    }, 1000);
  },
};

// When NOT to use arrow functions:
const obj = {
  name: "MyObj",
  // ✗ Arrow function — `this` is NOT the object
  badMethod: () => {
    // console.log(this.name); // undefined!
  },
  // ✓ Regular method — `this` IS the object
  goodMethod() {
    console.log(this.name); // "MyObj"
  },
};

// Don't use arrows for: object methods, prototypes, constructors, addEventListener handlers needing `this`

// ---- 3. ARRAY DESTRUCTURING ----

const colors = ["red", "green", "blue", "yellow", "purple"];

// Basic
const [first, second, third] = colors;
console.log(first, second, third); // "red" "green" "blue"

// Skip elements
const [, , thirdColor] = colors;
console.log(thirdColor); // "blue"

// Rest pattern
const [primary, ...others] = colors;
console.log(primary);  // "red"
console.log(others);   // ["green", "blue", "yellow", "purple"]

// Default values
const [a, b, c, d = "default"] = [1, 2, 3];
console.log(d); // "default"

// Swap variables
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2 1

// Nested array destructuring
const matrix = [[1, 2], [3, 4], [5, 6]];
const [[a1, a2], [b1, b2]] = matrix;
console.log(a1, a2, b1, b2); // 1 2 3 4

// From function return
function getCoordinates() {
  return [40.7128, -74.006];
}
const [lat, lng] = getCoordinates();

// ---- 4. OBJECT DESTRUCTURING ----

const user = {
  name: "Alice",
  age: 28,
  email: "alice@example.com",
  address: {
    city: "New York",
    country: "USA",
  },
};

// Basic
const { name, age, email } = user;
console.log(name, age); // "Alice" 28

// Renaming (alias)
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // "Alice" 28

// Default values
const { name: n, role = "user" } = user;
console.log(role); // "user"

// Nested destructuring
const { address: { city, country } } = user;
console.log(city, country); // "New York" "USA"

// Rest pattern
const { name: personName, ...rest } = user;
console.log(rest); // { age: 28, email: "...", address: {...} }

// Computed property names
const key = "email";
const { [key]: userEmail } = user;
console.log(userEmail); // "alice@example.com"

// ---- 5. DESTRUCTURING IN FUNCTION PARAMETERS ----

// Array parameter destructuring
function sum([a, b, c]) {
  return a + b + c;
}
console.log(sum([1, 2, 3])); // 6

// Object parameter destructuring (very common in React/APIs)
function createProfile({ name, age, role = "member", active = true }) {
  return { name, age, role, active };
}
console.log(createProfile({ name: "Bob", age: 30 }));

// With default for the whole parameter
function configure({ host = "localhost", port = 3000, debug = false } = {}) {
  console.log(`Server: ${host}:${port}, debug: ${debug}`);
}
configure();                    // Uses all defaults
configure({ port: 8080 });     // Override port only

// ---- 6. SPREAD OPERATOR ----

// Spread arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];     // [1, 2, 3, 4, 5, 6]
const withNew = [0, ...arr1, 4];       // [0, 1, 2, 3, 4]
const arrCopy = [...arr1];             // Shallow copy

// Spread objects
const defaults = { theme: "light", lang: "en", fontSize: 14 };
const prefs = { theme: "dark", fontSize: 18 };
const settings = { ...defaults, ...prefs }; // Later values override
console.log(settings); // { theme: "dark", lang: "en", fontSize: 18 }

// Immutable update pattern (common in React state)
const state = { count: 0, items: [1, 2, 3] };
const newState = {
  ...state,
  count: state.count + 1,
  items: [...state.items, 4],
};
console.log(newState); // { count: 1, items: [1, 2, 3, 4] }

// Spread in function calls
const nums = [5, 2, 8, 1, 9];
console.log(Math.max(...nums)); // 9

// Spread to convert iterables
const chars = [..."Hello"]; // ["H", "e", "l", "l", "o"]
const unique = [...new Set([1, 2, 2, 3, 3])]; // [1, 2, 3]

// ---- 7. REST PARAMETERS ----

// Collect remaining arguments into an array
function log(level, ...messages) {
  console.log(`[${level}]`, ...messages);
}
log("INFO", "Server started", "on port 3000");
log("ERROR", "Connection failed");

// Rest vs Spread:
// Rest:   collects INTO an array (in parameters/destructuring)
// Spread: expands FROM an array/object (in calls/literals)

// ---- 8. PRACTICAL PATTERNS ----

// Config merging
const createApp = (userConfig = {}) => {
  const config = {
    port: 3000,
    host: "localhost",
    debug: false,
    ...userConfig,
  };
  console.log("App config:", config);
};
createApp({ port: 8080, debug: true });

// Pick specific properties
const pick = (obj, ...keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {});
};
console.log(pick(user, "name", "email"));

// Omit specific properties
const omit = (obj, ...keys) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.includes(k))
  );
};
console.log(omit(user, "address"));

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Convert these to arrow functions:
//    function square(n) { return n * n; }
//    function isEven(n) { return n % 2 === 0; }
// 2. Destructure: const data = { user: { name: "A", scores: [90, 85, 92] } }
//    Extract name and the first two scores in one line
// 3. Write a merge function that deeply merges two objects (not just shallow)
// 4. Use spread to clone an array, add items, and remove duplicates
// 5. Create a function with destructured params + defaults for an API request config
// 6. Explain when arrow functions are inappropriate and give 3 examples
