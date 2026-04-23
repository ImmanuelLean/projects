// ============================================
// TYPE ALIASES vs INTERFACES
// ============================================

// ===== INTERFACE =====

interface User {
  id: number;
  name: string;
  email: string;
}

// Extending
interface Admin extends User {
  role: string;
  permissions: string[];
}

// Multiple extends
interface SuperAdmin extends Admin {
  canDeleteUsers: boolean;
}

// Declaration merging (interfaces auto-merge)
interface User {
  age?: number;  // adds to existing User interface
}

const user: User = { id: 1, name: "Alice", email: "a@b.com", age: 30 };

// ===== TYPE ALIAS =====

type Product = {
  id: number;
  name: string;
  price: number;
};

// Extending with intersection
type FeaturedProduct = Product & {
  featured: boolean;
  badge: string;
};

// Types can represent things interfaces can't
type ID = string | number;                    // union
type Status = "active" | "inactive";          // literal union
type Pair = [string, number];                 // tuple
type Callback = (data: string) => void;       // function type
type Nullable<T> = T | null;                  // generic alias
type Keys = keyof User;                       // "id" | "name" | "email" | "age"

// ===== COMPARISON =====

/*
┌─────────────────────────┬───────────┬──────────┐
│ Feature                 │ interface │ type     │
├─────────────────────────┼───────────┼──────────┤
│ Object shapes           │ ✅        │ ✅       │
│ Extend / inherit        │ extends   │ &        │
│ Declaration merging     │ ✅        │ ❌       │
│ Union types             │ ❌        │ ✅       │
│ Tuple types             │ ❌        │ ✅       │
│ Primitive aliases       │ ❌        │ ✅       │
│ Mapped types            │ ❌        │ ✅       │
│ Class implements        │ ✅        │ ✅       │
│ Computed properties     │ ❌        │ ✅       │
│ Performance (compiler)  │ slightly  │ slightly │
│                         │ better    │ slower   │
└─────────────────────────┴───────────┴──────────┘

RULE OF THUMB:
  - Use INTERFACE for object shapes and classes (public APIs)
  - Use TYPE for unions, tuples, mapped types, and computed types
  - Either works for objects — be consistent in your project
*/

// ===== INTERFACE: IMPLEMENTS =====

interface Printable {
  print(): string;
}

interface Loggable {
  log(): void;
}

class Document implements Printable, Loggable {
  constructor(public title: string) {}

  print(): string {
    return `Document: ${this.title}`;
  }

  log(): void {
    console.log(this.print());
  }
}

// ===== TYPE: IMPLEMENTS =====
// Types work with implements too (if they're object shapes)

type Serializable = {
  serialize(): string;
  deserialize(data: string): void;
};

class Config implements Serializable {
  data: Record<string, string> = {};

  serialize(): string {
    return JSON.stringify(this.data);
  }

  deserialize(raw: string): void {
    this.data = JSON.parse(raw);
  }
}

// ===== INTERFACE MERGING (unique to interfaces) =====

// Useful for extending third-party types
interface Window {
  myCustomProp: string;
}

// Express example:
// declare namespace Express {
//   interface Request {
//     userId: number;   // adds userId to every Request
//   }
// }

// ===== PRACTICAL PATTERNS =====

// API response shape
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// OR with type (discriminated union — better for responses)
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function fetchUser(id: number): Result<User> {
  if (id === 1) {
    return { ok: true, data: { id: 1, name: "Alice", email: "a@b.com" } };
  }
  return { ok: false, error: "User not found" };
}

const result = fetchUser(1);
if (result.ok) {
  console.log(result.data.name); // TS knows data exists
} else {
  console.log(result.error);     // TS knows error exists
}

// ===== INTERFACE FOR EXTENSIBLE APIs =====

interface EventMap {
  click: { x: number; y: number };
  keypress: { key: string; code: number };
  scroll: { position: number };
}

// Can be extended by consumers:
interface EventMap {
  custom: { data: string };  // merged!
}

type EventName = keyof EventMap; // "click" | "keypress" | "scroll" | "custom"

console.log("\n=== Type vs Interface ===");
console.log(`User: ${JSON.stringify(user)}`);
console.log(`Result: ${JSON.stringify(fetchUser(1))}`);
console.log(`Result: ${JSON.stringify(fetchUser(99))}`);

export {};
