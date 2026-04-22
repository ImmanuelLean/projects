// ============================================
// OBJECTS AND JSON
// ============================================

// ---- 1. OBJECT LITERALS ----

const person = {
  firstName: "Alice",
  lastName: "Smith",
  age: 28,
  isActive: true,
  hobbies: ["reading", "coding", "hiking"],
  address: {
    street: "123 Main St",
    city: "New York",
    zip: "10001",
  },
};

// Accessing properties
console.log(person.firstName);        // "Alice" (dot notation)
console.log(person["lastName"]);      // "Smith" (bracket notation)
console.log(person.address.city);     // "New York" (nested)

// Bracket notation — required for dynamic keys or special characters
const key = "age";
console.log(person[key]); // 28

// ---- 2. MODIFYING OBJECTS ----

// Add properties
person.email = "alice@example.com";
person["phone"] = "555-0123";

// Modify properties
person.age = 29;

// Delete properties
delete person.phone;

// Check if property exists
console.log("email" in person);              // true
console.log(person.hasOwnProperty("email")); // true
console.log(person.nickname);                // undefined (doesn't exist)

// ---- 3. OBJECT METHODS AND `this` ----

const calculator = {
  value: 0,
  add(n) {
    this.value += n;
    return this; // Enable chaining
  },
  subtract(n) {
    this.value -= n;
    return this;
  },
  reset() {
    this.value = 0;
    return this;
  },
  getResult() {
    return this.value;
  },
};

// Method chaining
const result = calculator.add(10).add(5).subtract(3).getResult();
console.log("Calculator:", result); // 12

// `this` in regular functions vs arrow functions
const obj = {
  name: "MyObject",
  regularMethod() {
    console.log(this.name); // "MyObject" — `this` = the object
  },
  arrowMethod: () => {
    // console.log(this.name); // undefined — arrow `this` = outer scope
  },
};
obj.regularMethod();

// ---- 4. OBJECT STATIC METHODS ----

const user = { name: "Bob", age: 30, role: "admin" };

// Object.keys() — array of keys
console.log(Object.keys(user)); // ["name", "age", "role"]

// Object.values() — array of values
console.log(Object.values(user)); // ["Bob", 30, "admin"]

// Object.entries() — array of [key, value] pairs
console.log(Object.entries(user)); // [["name","Bob"], ["age",30], ["role","admin"]]

// Iterating with Object.entries
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}

// Object.assign() — copy/merge objects
const defaults = { theme: "light", lang: "en", fontSize: 14 };
const prefs = { theme: "dark", fontSize: 18 };
const settings = Object.assign({}, defaults, prefs);
console.log(settings); // { theme: "dark", lang: "en", fontSize: 18 }

// Object.freeze() — make immutable
const frozen = Object.freeze({ x: 1, y: 2 });
frozen.x = 10; // Silently fails (throws in strict mode)
console.log(frozen.x); // 1

// Object.fromEntries() — create object from entries
const entries = [["a", 1], ["b", 2], ["c", 3]];
console.log(Object.fromEntries(entries)); // { a: 1, b: 2, c: 3 }

// ---- 5. SPREAD OPERATOR WITH OBJECTS ----

const base = { a: 1, b: 2, c: 3 };

// Shallow copy
const copy = { ...base };

// Merge (later values override)
const extended = { ...base, d: 4, b: 20 };
console.log(extended); // { a: 1, b: 20, c: 3, d: 4 }

// Useful for immutable updates
const state = { count: 0, name: "app" };
const newState = { ...state, count: state.count + 1 };
console.log(newState); // { count: 1, name: "app" }

// ---- 6. DESTRUCTURING OBJECTS ----

const { firstName: fName, age: userAge, email = "N/A" } = person;
console.log(fName);     // "Alice"
console.log(userAge);   // 29
console.log(email);     // "alice@example.com"

// Nested destructuring
const {
  address: { city, zip },
} = person;
console.log(city, zip); // "New York" "10001"

// Rest with destructuring
const { firstName: fn, ...remaining } = person;
console.log(remaining); // Everything except firstName

// Destructuring in function parameters
function displayUser({ name, age, role = "user" }) {
  console.log(`${name} (${age}) - ${role}`);
}
displayUser({ name: "Charlie", age: 35, role: "admin" });

// Shorthand property names
const x = 10, y = 20;
const point = { x, y }; // Same as { x: x, y: y }
console.log(point);

// Computed property names
const field = "email";
const data = { [field]: "test@test.com", [`${field}Verified`]: true };
console.log(data); // { email: "test@test.com", emailVerified: true }

// ---- 7. JSON (JavaScript Object Notation) ----

const product = {
  id: 1,
  name: "Laptop",
  price: 999.99,
  specs: { ram: "16GB", storage: "512GB SSD" },
  tags: ["electronics", "computers"],
};

// Object → JSON string
const jsonString = JSON.stringify(product);
console.log(jsonString);
console.log(typeof jsonString); // "string"

// Pretty-printed JSON
console.log(JSON.stringify(product, null, 2));

// JSON string → Object
const parsed = JSON.parse(jsonString);
console.log(parsed.name); // "Laptop"

// JSON rules:
// - Keys must be double-quoted strings
// - Values: string, number, boolean, null, array, object
// - No functions, undefined, or comments allowed
// - No trailing commas

// Selective stringify with replacer
const filtered = JSON.stringify(product, ["name", "price"]);
console.log(filtered); // {"name":"Laptop","price":999.99}

// Deep clone with JSON (simple but limited — no functions, dates, etc.)
const deepClone = JSON.parse(JSON.stringify(product));
deepClone.specs.ram = "32GB";
console.log(product.specs.ram); // "16GB" — original unchanged

// Modern deep clone
const modernClone = structuredClone(product);

// ---- 8. NESTED OBJECTS ----

const company = {
  name: "TechCorp",
  departments: {
    engineering: {
      lead: "Alice",
      team: ["Bob", "Charlie", "Diana"],
      budget: 500000,
    },
    marketing: {
      lead: "Eve",
      team: ["Frank"],
      budget: 200000,
    },
  },
};

// Optional chaining — safe access to nested properties
console.log(company.departments.engineering.lead); // "Alice"
console.log(company.departments.sales?.lead);       // undefined (no error)
console.log(company.departments.sales?.team?.length ?? 0); // 0

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create an object representing a book (title, author, year, genres array)
//    and convert it to JSON and back
// 2. Write a function that merges two objects, with the second overriding conflicts
// 3. Use destructuring to extract deeply nested properties from an object
// 4. Given an array of objects [{name, score}], create an object mapping name → score
// 5. Implement a function that deep compares two objects for equality
// 6. Use Object.entries + reduce to filter an object (keep only values > 10)
