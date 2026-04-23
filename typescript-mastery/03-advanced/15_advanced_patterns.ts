// ============================================
// ADVANCED TYPESCRIPT PATTERNS
// ============================================

// ===== BRANDED TYPES =====
// Prevent mixing up values of the same underlying type

type Brand<T, B extends string> = T & { readonly __brand: B };

type USD = Brand<number, "USD">;
type EUR = Brand<number, "EUR">;
type UserId = Brand<number, "UserId">;
type PostId = Brand<number, "PostId">;

function usd(amount: number): USD { return amount as USD; }
function eur(amount: number): EUR { return amount as EUR; }
function userId(id: number): UserId { return id as UserId; }

const price = usd(29.99);
const euroPrice = eur(25.99);

function chargeUSD(amount: USD): void {
  console.log(`Charging $${amount}`);
}

chargeUSD(price);        // ✅
// chargeUSD(euroPrice);  // ❌ EUR is not assignable to USD
// chargeUSD(29.99);      // ❌ number is not assignable to USD

function getUser(id: UserId): void {}
function getPost(id: PostId): void {}

const uid = userId(1);
// getPost(uid);  // ❌ UserId is not assignable to PostId

// ===== BUILDER PATTERN =====

class QueryBuilder<
  Selected extends string = never,
  Filtered extends boolean = false,
  Ordered extends boolean = false,
> {
  private _table = "";
  private _columns: string[] = [];
  private _where: string[] = [];
  private _orderBy = "";

  static from(table: string): QueryBuilder {
    const qb = new QueryBuilder();
    qb._table = table;
    return qb;
  }

  select<C extends string>(...columns: C[]): QueryBuilder<C, Filtered, Ordered> {
    this._columns = columns;
    return this as any;
  }

  where(condition: string): QueryBuilder<Selected, true, Ordered> {
    this._where.push(condition);
    return this as any;
  }

  orderBy(column: string): QueryBuilder<Selected, Filtered, true> {
    this._orderBy = column;
    return this as any;
  }

  build(): string {
    const cols = this._columns.length ? this._columns.join(", ") : "*";
    let query = `SELECT ${cols} FROM ${this._table}`;
    if (this._where.length) query += ` WHERE ${this._where.join(" AND ")}`;
    if (this._orderBy) query += ` ORDER BY ${this._orderBy}`;
    return query;
  }
}

const query = QueryBuilder
  .from("users")
  .select("name", "email")
  .where("active = true")
  .orderBy("name")
  .build();

console.log(query);

// ===== TYPE-SAFE EVENT EMITTER =====

type EventMap = Record<string, unknown>;

class TypedEventEmitter<Events extends EventMap> {
  private listeners = new Map<keyof Events, Set<Function>>();

  on<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener);
    return () => this.listeners.get(event)?.delete(listener);
  }

  emit<K extends keyof Events>(
    event: K,
    ...[data]: Events[K] extends void ? [] : [Events[K]]
  ): void {
    this.listeners.get(event)?.forEach(fn => fn(data));
  }
}

interface AppEvents {
  "user:login": { userId: number; timestamp: Date };
  "user:logout": void;
  "post:created": { postId: number; title: string };
  "error": { message: string; code: number };
}

const events = new TypedEventEmitter<AppEvents>();
events.on("user:login", (data) => {
  console.log(`User ${data.userId} logged in`); // data is typed!
});
events.emit("user:login", { userId: 1, timestamp: new Date() });
events.emit("user:logout");
// events.emit("user:login", { wrong: true }); // ❌ Type error

// ===== PHANTOM TYPES =====

// Types that only exist at compile time for safety
type Locked = { readonly __state: "locked" };
type Unlocked = { readonly __state: "unlocked" };

class Door<State = Unlocked> {
  private constructor(private name: string) {}

  static create(name: string): Door<Unlocked> {
    return new Door(name) as Door<Unlocked>;
  }

  lock(this: Door<Unlocked>): Door<Locked> {
    console.log(`${this.name}: Locked`);
    return this as unknown as Door<Locked>;
  }

  unlock(this: Door<Locked>): Door<Unlocked> {
    console.log(`${this.name}: Unlocked`);
    return this as unknown as Door<Unlocked>;
  }

  open(this: Door<Unlocked>): void {
    console.log(`${this.name}: Opened`);
  }
}

const door = Door.create("Front");
door.open();              // ✅ unlocked, can open
const locked = door.lock();
// locked.open();         // ❌ can't open a locked door!
const unlocked = locked.unlock();
unlocked.open();          // ✅

// ===== TYPE-SAFE API CLIENT =====

interface ApiEndpoints {
  "GET /users": { response: User[]; query: { page?: number } };
  "GET /users/:id": { response: User; params: { id: string } };
  "POST /users": { response: User; body: CreateUserInput };
  "PUT /users/:id": { response: User; params: { id: string }; body: Partial<User> };
  "DELETE /users/:id": { response: void; params: { id: string } };
}

interface User { id: number; name: string; email: string; }
interface CreateUserInput { name: string; email: string; }

type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<Rest>]: string }
    : T extends `${string}:${infer Param}`
      ? { [K in Param]: string }
      : {};

// Type-safe fetch wrapper
async function api<E extends keyof ApiEndpoints>(
  endpoint: E,
  ...args: ApiEndpoints[E] extends { body: infer B }
    ? [options: { body: B } & Partial<ApiEndpoints[E]>]
    : ApiEndpoints[E] extends { params: infer P }
      ? [options: { params: P }]
      : [options?: Partial<ApiEndpoints[E]>]
): Promise<ApiEndpoints[E]["response"]> {
  // implementation
  return {} as any;
}

// Usage — fully type-safe!
// const users = await api("GET /users");                           // User[]
// const user = await api("GET /users/:id", { params: { id: "1" } }); // User
// const newUser = await api("POST /users", { body: { name: "Alice", email: "a@b" } }); // User

// ===== PIPE / COMPOSE =====

type Fn<A = any, B = any> = (arg: A) => B;

function pipe<A, B>(f: Fn<A, B>): Fn<A, B>;
function pipe<A, B, C>(f: Fn<A, B>, g: Fn<B, C>): Fn<A, C>;
function pipe<A, B, C, D>(f: Fn<A, B>, g: Fn<B, C>, h: Fn<C, D>): Fn<A, D>;
function pipe(...fns: Fn[]): Fn {
  return (arg) => fns.reduce((result, fn) => fn(result), arg);
}

const transform = pipe(
  (s: string) => s.trim(),
  (s: string) => s.toLowerCase(),
  (s: string) => s.split(" "),
);

console.log(transform("  Hello World  ")); // ["hello", "world"]

// ===== EXHAUSTIVE SWITCH =====

function assertNever(x: never, message?: string): never {
  throw new Error(message ?? `Unexpected value: ${x}`);
}

type Shape =
  | { type: "circle"; radius: number }
  | { type: "square"; side: number }
  | { type: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.type) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.side ** 2;
    case "triangle": return (shape.base * shape.height) / 2;
    default: return assertNever(shape); // ❌ compile error if case missing
  }
}

console.log("\n=== Advanced Patterns ===");
console.log(`Query: ${query}`);
console.log(`Area of circle(5): ${area({ type: "circle", radius: 5 }).toFixed(2)}`);
console.log(`Transform: ${transform("  Hello World  ")}`);

export {};
