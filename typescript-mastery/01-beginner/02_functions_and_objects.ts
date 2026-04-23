// ============================================
// FUNCTIONS & OBJECT TYPES
// ============================================

// ===== FUNCTION TYPES =====

// Parameter and return types
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Optional parameters (?)
function greet(name: string, title?: string): string {
  return title ? `Hello, ${title} ${name}` : `Hello, ${name}`;
}
console.log(greet("Alice"));           // "Hello, Alice"
console.log(greet("Alice", "Dr."));    // "Hello, Dr. Alice"

// Default parameters
function createUser(name: string, role: string = "user"): object {
  return { name, role };
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// Function type expression
type MathFn = (a: number, b: number) => number;

const subtract: MathFn = (a, b) => a - b;  // types inferred from MathFn

// Callback types
function processArray(arr: number[], callback: (n: number) => number): number[] {
  return arr.map(callback);
}
console.log(processArray([1, 2, 3], (n) => n * 2)); // [2, 4, 6]

// Void callbacks
function doSomething(callback: () => void): void {
  callback();
}

// Function overloads
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  if (typeof value === "string") return value.trim();
  return value.toFixed(2);
}
console.log(format("  hello  "));  // "hello"
console.log(format(3.14159));      // "3.14"

// ===== OBJECT TYPES =====

// Inline object type
function printUser(user: { name: string; age: number }): void {
  console.log(`${user.name}, age ${user.age}`);
}

// Optional properties
function printConfig(config: { host: string; port?: number }): void {
  console.log(`${config.host}:${config.port ?? 3000}`);
}

// Readonly properties
function displayPoint(point: { readonly x: number; readonly y: number }): void {
  // point.x = 10; // ❌ Error: Cannot assign to 'x' because it is a read-only property
  console.log(`(${point.x}, ${point.y})`);
}

// ===== INTERFACES =====

interface User {
  id: number;
  name: string;
  email: string;
  age?: number;                    // optional
  readonly createdAt: Date;        // read-only
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@test.com",
  createdAt: new Date(),
};

// Extending interfaces
interface Admin extends User {
  role: "admin" | "superadmin";
  permissions: string[];
}

const admin: Admin = {
  id: 2,
  name: "Bob",
  email: "bob@test.com",
  createdAt: new Date(),
  role: "admin",
  permissions: ["users:read", "users:write"],
};

// Interface with methods
interface Logger {
  info(message: string): void;
  error(message: string, error?: Error): void;
  level: "debug" | "info" | "warn" | "error";
}

// Interface with index signature
interface Dictionary {
  [key: string]: string;
}

const colors: Dictionary = {
  red: "#ff0000",
  blue: "#0000ff",
};

// Interface with call signature
interface Formatter {
  (value: string): string;
}

const upperFormatter: Formatter = (value) => value.toUpperCase();

// ===== TYPE ALIASES =====

type Point = {
  x: number;
  y: number;
};

type ID = number | string;

type Status = "active" | "inactive" | "pending";

type EventHandler = (event: string, data: unknown) => void;

// ===== INTERSECTION TYPES =====

type HasName = { name: string };
type HasAge = { age: number };
type Person = HasName & HasAge; // must have both

const person: Person = { name: "Alice", age: 30 };

// ===== READONLY & RECORD =====

// Readonly object
const config: Readonly<{ host: string; port: number }> = {
  host: "localhost",
  port: 3000,
};
// config.port = 8080; // ❌ Error

// Record: define object with specific key/value types
const userRoles: Record<string, string[]> = {
  alice: ["admin", "editor"],
  bob: ["viewer"],
};

console.log("\n=== Functions & Objects ===");
console.log(`add(2, 3) = ${add(2, 3)}`);
console.log(`User: ${user.name}, ${user.email}`);
console.log(`Admin: ${admin.name}, role=${admin.role}`);

export {};
