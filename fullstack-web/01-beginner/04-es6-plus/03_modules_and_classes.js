// ============================================
// MODULES, CLASSES & MODERN FEATURES
// ============================================

// ---- 1. ES6 MODULES ----

// Named exports (can have multiple per file)
// file: math.js
// export const PI = 3.14159;
// export function add(a, b) { return a + b; }
// export function multiply(a, b) { return a * b; }

// Default export (one per file)
// file: User.js
// export default class User { ... }

// Named imports
// import { add, multiply } from './math.js';
// import { add as addition } from './math.js';  // Rename
// import * as math from './math.js';             // Import all

// Default import
// import User from './User.js';
// import User, { helperFn } from './User.js';    // Default + named

// Re-exporting (barrel file pattern)
// file: index.js
// export { add, multiply } from './math.js';
// export { default as User } from './User.js';

// Dynamic imports (code splitting — loads on demand)
// const module = await import('./heavy-module.js');
// module.doSomething();

// Conditional dynamic import
async function loadChart() {
  if (typeof document !== "undefined") {
    const { Chart } = await import("./chart.js");
    return new Chart();
  }
}

// ---- 2. CLASSES ----

class Animal {
  // Constructor — called with `new`
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
    this._energy = 100; // Convention: _ means "treat as private"
  }

  // Methods
  speak() {
    return `${this.name} says ${this.sound}!`;
  }

  eat(food) {
    this._energy += 10;
    return `${this.name} eats ${food}. Energy: ${this._energy}`;
  }

  // Getter (accessed like a property)
  get info() {
    return `${this.name} (${this.constructor.name})`;
  }

  // Setter
  set energy(value) {
    if (value < 0) throw new Error("Energy can't be negative");
    this._energy = value;
  }

  get energy() {
    return this._energy;
  }

  // Static method (called on the class, not instances)
  static compare(a, b) {
    return a._energy - b._energy;
  }

  // toString override
  toString() {
    return `[Animal: ${this.name}]`;
  }
}

const dog = new Animal("Rex", "Woof");
console.log(dog.speak());      // "Rex says Woof!"
console.log(dog.eat("bone"));  // "Rex eats bone. Energy: 110"
console.log(dog.info);         // "Rex (Animal)"
console.log(Animal.compare(dog, new Animal("Cat", "Meow"))); // 10

// ---- 3. INHERITANCE ----

class Dog extends Animal {
  constructor(name, breed) {
    super(name, "Woof"); // Call parent constructor
    this.breed = breed;
  }

  // Override parent method
  speak() {
    return `${this.name} the ${this.breed} barks: ${this.sound}!`;
  }

  // New method
  fetch(item) {
    this._energy -= 20;
    return `${this.name} fetches the ${item}!`;
  }

  // Call parent method with super
  eat(food) {
    const result = super.eat(food);
    return result + " (Good dog!)";
  }
}

const buddy = new Dog("Buddy", "Golden Retriever");
console.log(buddy.speak());         // Override
console.log(buddy.fetch("ball"));   // New method
console.log(buddy.eat("kibble"));   // Calls parent + extends

console.log(buddy instanceof Dog);    // true
console.log(buddy instanceof Animal); // true

// ---- 4. PRIVATE FIELDS (#) ----

class BankAccount {
  #balance; // Truly private — not accessible outside class
  #owner;

  constructor(owner, initialBalance = 0) {
    this.#owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Invalid amount");
    this.#balance += amount;
    return this.#getStatement("Deposit", amount);
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    return this.#getStatement("Withdrawal", amount);
  }

  // Private method
  #getStatement(type, amount) {
    return `${type}: $${amount}. Balance: $${this.#balance}`;
  }

  get balance() {
    return this.#balance;
  }

  static #bankName = "MyBank"; // Private static field

  static getBankName() {
    return BankAccount.#bankName;
  }
}

const account = new BankAccount("Alice", 1000);
console.log(account.deposit(500));     // "Deposit: $500. Balance: $1500"
console.log(account.withdraw(200));    // "Withdrawal: $200. Balance: $1300"
console.log(account.balance);          // 1300
// console.log(account.#balance);      // SyntaxError! Private field

// ---- 5. STATIC METHODS AND PROPERTIES ----

class MathUtils {
  static PI = 3.14159;

  static circle(radius) {
    return {
      area: MathUtils.PI * radius ** 2,
      circumference: 2 * MathUtils.PI * radius,
    };
  }

  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

console.log(MathUtils.PI);               // 3.14159
console.log(MathUtils.circle(5));        // { area: 78.5, circumference: 31.4 }
// const m = new MathUtils(); m.circle(5); // Error — static methods aren't on instances

// ---- 6. MAP, SET, WEAKMAP, WEAKSET ----

// Map — key-value pairs (any type as key, ordered, iterable)
const map = new Map();
map.set("name", "Alice");
map.set(42, "a number key");
map.set(true, "a boolean key");
const objKey = { id: 1 };
map.set(objKey, "object as key!");

console.log(map.get("name"));   // "Alice"
console.log(map.has(42));       // true
console.log(map.size);          // 4

for (const [key, value] of map) {
  console.log(`${key} => ${value}`);
}

// Map from array/entries
const userMap = new Map([
  ["alice", { age: 25 }],
  ["bob", { age: 30 }],
]);

// Set — unique values only (ordered, iterable)
const set = new Set([1, 2, 3, 2, 1, 4]);
console.log(set);        // Set { 1, 2, 3, 4 }
console.log(set.size);   // 4
set.add(5);
set.delete(2);
console.log(set.has(3)); // true

// Remove duplicates from array
const unique = [...new Set([1, 2, 2, 3, 3, 4])];
console.log(unique); // [1, 2, 3, 4]

// WeakMap — keys must be objects, keys are weakly referenced (GC-able)
// Use for: caching, private data, metadata on objects
const cache = new WeakMap();
function expensiveCalc(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = obj.value * 2; // Simulate expensive work
  cache.set(obj, result);
  return result;
}

// WeakSet — same but for unique object references
const visited = new WeakSet();

// ---- 7. OPTIONAL CHAINING & NULLISH COALESCING ----

const config = {
  database: {
    host: "localhost",
    port: 5432,
    // credentials is not defined
  },
};

// Optional chaining (?.) — returns undefined instead of throwing
console.log(config.database?.host);           // "localhost"
console.log(config.database?.credentials?.user); // undefined (no error!)
console.log(config.api?.url);                  // undefined

// With arrays and methods
const users = [{ name: "Alice" }];
console.log(users[0]?.name);                // "Alice"
console.log(users[5]?.name);                // undefined
console.log(users[0]?.getName?.());          // undefined (method doesn't exist)

// Nullish coalescing (??) — fallback for null/undefined ONLY
console.log(null ?? "default");       // "default"
console.log(undefined ?? "default");  // "default"
console.log(0 ?? "default");         // 0 (0 is not null/undefined!)
console.log("" ?? "default");        // "" (empty string is not null/undefined!)
console.log(false ?? "default");     // false

// Compare with || (logical OR — falsy fallback)
console.log(0 || "default");         // "default" (0 is falsy)
console.log("" || "default");        // "default" (empty string is falsy)

// Assignment operators
let val;
val ??= "fallback"; // Assign only if null/undefined
console.log(val);    // "fallback"

val &&= "updated";  // Assign only if truthy
val ||= "other";    // Assign only if falsy

// ---- 8. SYMBOLS AND ITERATORS (Brief) ----

// Symbols — unique identifiers, useful as object keys
const ID = Symbol("id");
const user2 = { [ID]: 123, name: "Bob" };
console.log(user2[ID]);  // 123
// Symbols don't show up in for...in or Object.keys()

// Well-known symbols
// Symbol.iterator — makes objects iterable with for...of
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { done: true };
      },
    };
  }
}

const range = new Range(1, 5);
for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}
console.log([...range]); // [1, 2, 3, 4, 5]

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create a class `Stack` with push, pop, peek, isEmpty, and size methods
// 2. Create a `Vehicle` base class and `Car`/`Motorcycle` subclasses with inheritance
// 3. Use private fields to create a `Password` class that hashes and validates
// 4. Use a Map to count word frequencies in a string
// 5. Use a Set to find the intersection of two arrays
// 6. Create a custom iterable class that generates the Fibonacci sequence up to n
// 7. Rewrite object access chains using optional chaining and nullish coalescing
