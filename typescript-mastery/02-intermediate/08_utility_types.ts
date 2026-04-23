// ============================================
// BUILT-IN UTILITY TYPES
// ============================================

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: "admin" | "user";
  createdAt: Date;
}

// ===== Partial<T> — all properties optional =====
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; ... }

function updateUser(id: number, updates: Partial<User>): void {
  console.log(`Updating user ${id}`, updates);
}
updateUser(1, { name: "Alice" }); // only update name

// ===== Required<T> — all properties required =====
type RequiredUser = Required<User>; // removes all ?

// ===== Readonly<T> — all properties readonly =====
type FrozenUser = Readonly<User>;
const frozen: FrozenUser = { id: 1, name: "A", email: "a@b", age: 30, role: "user", createdAt: new Date() };
// frozen.name = "B"; // ❌ Error

// ===== Pick<T, K> — select specific properties =====
type UserPreview = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string }

const preview: UserPreview = { id: 1, name: "Alice", email: "a@b.com" };

// ===== Omit<T, K> — remove specific properties =====
type CreateUser = Omit<User, "id" | "createdAt">;
// { name: string; email: string; age: number; role: "admin" | "user" }

const newUser: CreateUser = { name: "Bob", email: "b@c.com", age: 25, role: "user" };

// ===== Record<K, V> — object with specific key/value types =====
type UserMap = Record<number, User>;
type StatusCounts = Record<"active" | "inactive" | "pending", number>;

const counts: StatusCounts = { active: 10, inactive: 5, pending: 3 };

// Dynamic lookup
type PageRoutes = Record<string, () => void>;
const routes: PageRoutes = {
  "/home": () => console.log("Home"),
  "/about": () => console.log("About"),
};

// ===== Exclude<T, U> — remove types from union =====
type AllStatus = "active" | "inactive" | "pending" | "deleted";
type ActiveStatus = Exclude<AllStatus, "deleted">;
// "active" | "inactive" | "pending"

// ===== Extract<T, U> — keep only matching types =====
type StringOrNumber = Extract<string | number | boolean | Date, string | number>;
// string | number

// ===== NonNullable<T> — remove null and undefined =====
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string

// ===== ReturnType<T> — get function return type =====
function fetchUsers() {
  return [{ id: 1, name: "Alice" }];
}
type FetchResult = ReturnType<typeof fetchUsers>; // { id: number; name: string }[]

// ===== Parameters<T> — get function parameter types =====
function createProduct(name: string, price: number, stock: number) {
  return { name, price, stock };
}
type CreateProductParams = Parameters<typeof createProduct>;
// [name: string, price: number, stock: number]

// ===== Awaited<T> — unwrap Promise type =====
type AsyncResult = Awaited<Promise<string>>; // string
type NestedAsync = Awaited<Promise<Promise<number>>>; // number

async function getData(): Promise<{ users: User[] }> {
  return { users: [] };
}
type DataType = Awaited<ReturnType<typeof getData>>; // { users: User[] }

// ===== ConstructorParameters<T> =====
class Point {
  constructor(public x: number, public y: number) {}
}
type PointArgs = ConstructorParameters<typeof Point>; // [x: number, y: number]

// ===== InstanceType<T> =====
type PointInstance = InstanceType<typeof Point>; // Point

// ===== COMBINING UTILITY TYPES =====

// Create input type from model
type UserInput = Omit<User, "id" | "createdAt">;

// Partial update
type UserUpdate = Partial<Omit<User, "id" | "createdAt">>;

// Readonly response
type UserResponse = Readonly<Pick<User, "id" | "name" | "email">>;

// API endpoints pattern
interface CrudTypes<T, CreateInput = Omit<T, "id" | "createdAt">> {
  getAll: () => Promise<T[]>;
  getById: (id: number) => Promise<T | null>;
  create: (data: CreateInput) => Promise<T>;
  update: (id: number, data: Partial<CreateInput>) => Promise<T>;
  delete: (id: number) => Promise<void>;
}

// ===== PRACTICAL EXAMPLE: Form TYPES =====

interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
}

// Generate form state from model
type FormState<T> = {
  [K in keyof T]: FormField;
};

type LoginForm = FormState<{ email: string; password: string }>;
// { email: FormField; password: FormField }

const loginForm: LoginForm = {
  email: { value: "", error: null, touched: false },
  password: { value: "", error: null, touched: false },
};

console.log("\n=== Utility Types ===");
console.log(`Preview: ${JSON.stringify(preview)}`);
console.log(`Counts: ${JSON.stringify(counts)}`);
console.log(`LoginForm: ${JSON.stringify(loginForm)}`);

export {};
