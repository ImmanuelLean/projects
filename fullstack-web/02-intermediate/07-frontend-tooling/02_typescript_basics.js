// ============================================
// TYPESCRIPT BASICS
// ============================================
// TypeScript adds static types to JavaScript.
// Install: npm install -D typescript
// Init:    npx tsc --init (creates tsconfig.json)
// Compile: npx tsc (compiles .ts to .js)

// ---- 1. BASIC TYPES ----

const basicTypes = `
// Primitive types
let name: string = "Alice";
let age: number = 28;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// Type inference (TypeScript figures out the type)
let city = "New York";  // TypeScript infers: string
let count = 42;         // TypeScript infers: number

// Arrays
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];
let mixed: (string | number)[] = [1, "two", 3];

// Alternative array syntax
let scores: Array<number> = [90, 85, 92];

// Tuple (fixed-length array with specific types)
let pair: [string, number] = ["Alice", 28];
let rgb: [number, number, number] = [255, 128, 0];

// Enum
enum Role {
  User = "USER",
  Admin = "ADMIN",
  Moderator = "MODERATOR",
}
let userRole: Role = Role.Admin;

// Any (opt-out of type checking — avoid!)
let anything: any = "hello";
anything = 42;  // No error, but defeats the purpose

// Unknown (safer than any — must check type before using)
let data: unknown = "hello";
if (typeof data === "string") {
  console.log(data.toUpperCase());  // OK after type check
}

// Void (function returns nothing)
function log(msg: string): void {
  console.log(msg);
}

// Never (function never returns — throws or infinite loop)
function throwError(msg: string): never {
  throw new Error(msg);
}
`;

// ---- 2. OBJECTS AND INTERFACES ----

const objectTypes = `
// Object type annotation
let user: { name: string; age: number; email?: string } = {
  name: "Alice",
  age: 28,
};

// Interface — define object shapes (preferred for objects)
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;            // Optional property
  readonly createdAt: Date; // Can't be modified after creation
}

const alice: User = {
  id: 1,
  name: "Alice",
  email: "alice@test.com",
  createdAt: new Date(),
};

// Extending interfaces
interface AdminUser extends User {
  role: "admin";
  permissions: string[];
}

// Type alias — can be used for any type (not just objects)
type ID = number | string;
type Status = "active" | "inactive" | "suspended";
type Coordinate = [number, number];

type Product = {
  id: number;
  name: string;
  price: number;
  status: Status;
};

// Interface vs Type:
// - Interface: extendable, mergeable, better for object shapes
// - Type: can represent unions, tuples, primitives, more flexible
`;

// ---- 3. FUNCTIONS ----

const functionTypes = `
// Function type annotations
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Optional and default parameters
function greet(name: string, greeting: string = "Hello"): string {
  return greeting + ", " + name;
}

// Rest parameters
function sum(...nums: number[]): number {
  return nums.reduce((total, n) => total + n, 0);
}

// Function type alias
type MathFn = (a: number, b: number) => number;
const subtract: MathFn = (a, b) => a - b;

// Callback type
function fetchData(url: string, callback: (data: unknown) => void): void {
  // ...
}

// Async function
async function getUser(id: number): Promise<User> {
  const response = await fetch("/api/users/" + id);
  return response.json();
}

// Overloads
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  return String(value);
}
`;

// ---- 4. UNION AND INTERSECTION TYPES ----

const unionIntersection = `
// Union (OR — can be either type)
type StringOrNumber = string | number;
let id: StringOrNumber = "abc";
id = 123; // Also OK

// Narrowing (type guards)
function display(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());  // TS knows it's a string
  } else {
    console.log(value.toFixed(2));     // TS knows it's a number
  }
}

// Literal types
type Direction = "up" | "down" | "left" | "right";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Intersection (AND — must have all properties)
type Timestamped = { createdAt: Date; updatedAt: Date };
type SoftDeletable = { deletedAt?: Date; isDeleted: boolean };
type BaseEntity = Timestamped & SoftDeletable;

interface Post extends BaseEntity {
  id: number;
  title: string;
  content: string;
}
`;

// ---- 5. GENERICS ----

const generics = `
// Generic function — works with any type while maintaining type safety
function identity<T>(value: T): T {
  return value;
}
const str = identity<string>("hello");  // Type is string
const num = identity(42);              // Inferred: number

// Generic array function
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Generic interface
interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
}

const userResponse: ApiResponse<User> = {
  status: "success",
  data: { id: 1, name: "Alice", email: "a@b.com", createdAt: new Date() },
};

// Generic with constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Generic class
class Repository<T extends { id: number }> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }
}
`;

// ---- 6. UTILITY TYPES ----

const utilityTypes = `
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

// Partial<T> — all properties optional
type UpdateUser = Partial<User>;
// { id?: number; name?: string; ... }

// Required<T> — all properties required
type RequiredUser = Required<User>;

// Pick<T, K> — select specific properties
type UserPreview = Pick<User, "id" | "name" | "email">;

// Omit<T, K> — exclude specific properties
type SafeUser = Omit<User, "password">;

// Readonly<T> — all properties readonly
type FrozenUser = Readonly<User>;

// Record<K, V> — object with keys K and values V
type UserRoles = Record<string, "admin" | "user" | "moderator">;

// ReturnType<T> — get return type of a function
type FetchResult = ReturnType<typeof fetch>; // Promise<Response>

// Exclude, Extract
type AllStatus = "active" | "inactive" | "banned" | "pending";
type ActiveStatus = Exclude<AllStatus, "banned" | "inactive">; // "active" | "pending"
`;

// ---- 7. TSCONFIG.JSON ----

const tsconfig = `
{
  "compilerOptions": {
    "target": "ES2020",           // Output JS version
    "module": "ESNext",           // Module system
    "lib": ["ES2020", "DOM"],     // Available APIs
    "outDir": "./dist",           // Output directory
    "rootDir": "./src",           // Source directory
    "strict": true,               // Enable all strict checks
    "esModuleInterop": true,      // CommonJS/ES module interop
    "skipLibCheck": true,         // Skip .d.ts checking (faster)
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,    // Import .json files
    "declaration": true,          // Generate .d.ts files
    "declarationMap": true,       // Source maps for declarations
    "sourceMap": true,            // Source maps for debugging
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]            // Path alias
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`;

console.log("TypeScript Basics complete!");
console.log("Key: types, interfaces, generics, utility types, tsconfig");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create interfaces for a blog: User, Post, Comment with proper types and relations
// 2. Write a generic function fetchApi<T>(url: string): Promise<T>
// 3. Use utility types to create: SafeUser (no password), UpdatePostDto (partial), etc.
// 4. Write a function that uses union types and type narrowing
// 5. Set up tsconfig.json with strict mode and path aliases
// 6. Convert an existing .js file to .ts with proper type annotations
