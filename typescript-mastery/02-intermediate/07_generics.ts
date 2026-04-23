// ============================================
// GENERICS — TYPE PARAMETERS
// ============================================

// ===== WHY GENERICS? =====

// Without generics: lose type info or duplicate code
function identityAny(value: any): any { return value; }  // ❌ loses type
function identityString(value: string): string { return value; } // only strings
function identityNumber(value: number): number { return value; } // only numbers

// With generics: works with ANY type while preserving it
function identity<T>(value: T): T {
  return value;
}

const str = identity("hello");   // type: string
const num = identity(42);        // type: number
const obj = identity({ x: 1 }); // type: { x: number }

// Explicit type argument (usually inferred)
const explicit = identity<string>("hello");

// ===== GENERIC FUNCTIONS =====

function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const first1 = firstElement([1, 2, 3]);       // number | undefined
const first2 = firstElement(["a", "b"]);       // string | undefined

// Multiple type parameters
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const p = pair("hello", 42); // [string, number]

function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const lengths = map(["hello", "world"], (s) => s.length); // number[]

// ===== GENERIC CONSTRAINTS =====

// Constrain with extends
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

getLength("hello");           // ✅ string has .length
getLength([1, 2, 3]);         // ✅ array has .length
// getLength(42);             // ❌ number has no .length

// Constrain with keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30, email: "a@b.com" };
const name1 = getProperty(user, "name"); // string
// getProperty(user, "foo");             // ❌ Error

// ===== GENERIC INTERFACES =====

interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    total: number;
    totalPages: number;
  };
}

type UserResponse = ApiResponse<{ id: number; name: string }>;
type UserListResponse = PaginatedResponse<{ id: number; name: string }>;

// ===== GENERIC CLASSES =====

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  toArray(): readonly T[] {
    return [...this.items];
  }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
console.log(numStack.pop()); // 2

class Repository<T extends { id: number }> {
  private items: Map<number, T> = new Map();

  add(item: T): void {
    this.items.set(item.id, item);
  }

  get(id: number): T | undefined {
    return this.items.get(id);
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }

  delete(id: number): boolean {
    return this.items.delete(id);
  }
}

interface Product { id: number; name: string; price: number }
const productRepo = new Repository<Product>();
productRepo.add({ id: 1, name: "Widget", price: 9.99 });

// ===== GENERIC DEFAULTS =====

interface Config<T = Record<string, unknown>> {
  data: T;
  debug: boolean;
}

const defaultConfig: Config = { data: {}, debug: false };
const typedConfig: Config<{ host: string }> = { data: { host: "localhost" }, debug: true };

// ===== GENERIC UTILITY FUNCTIONS =====

// Type-safe event emitter
type EventHandler<T = void> = T extends void ? () => void : (data: T) => void;

class TypedEmitter<Events extends Record<string, unknown>> {
  private handlers = new Map<string, Function[]>();

  on<E extends keyof Events>(event: E, handler: EventHandler<Events[E]>): void {
    const list = this.handlers.get(event as string) || [];
    list.push(handler);
    this.handlers.set(event as string, list);
  }

  emit<E extends keyof Events>(event: E, ...args: Events[E] extends void ? [] : [Events[E]]): void {
    const list = this.handlers.get(event as string) || [];
    list.forEach((fn) => fn(...args));
  }
}

interface AppEvents {
  login: { userId: number; timestamp: Date };
  logout: void;
  error: { message: string; code: number };
}

const emitter = new TypedEmitter<AppEvents>();
emitter.on("login", (data) => {
  console.log(`User ${data.userId} logged in`); // data is typed!
});
emitter.on("logout", () => console.log("Logged out"));
emitter.emit("login", { userId: 1, timestamp: new Date() });

console.log("\n=== Generics ===");
console.log(`identity("hello") = ${identity("hello")}`);
console.log(`pair("a", 1) = ${JSON.stringify(pair("a", 1))}`);
console.log(`Stack size: ${numStack.size}`);

export {};
