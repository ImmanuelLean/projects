// ============================================
// UNION TYPES & TYPE NARROWING
// ============================================

// ===== UNION TYPES =====

// A value can be one of several types
type ID = string | number;

function printId(id: ID): void {
  console.log(`ID: ${id}`);
}
printId(101);      // ✅
printId("abc-123"); // ✅
// printId(true);  // ❌ Error

// Union of literals (string enum alternative)
type Direction = "north" | "south" | "east" | "west";
type Status = "idle" | "loading" | "success" | "error";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

function move(direction: Direction): void {
  console.log(`Moving ${direction}`);
}
move("north"); // ✅
// move("up");  // ❌ Error

// Nullable types
type MaybeString = string | null;
type Optional<T> = T | undefined;

function findUser(id: number): { name: string } | null {
  if (id === 1) return { name: "Alice" };
  return null;
}

// ===== TYPE NARROWING =====

// TypeScript narrows types inside conditional blocks

// 1. typeof narrowing
function process(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();    // TS knows it's string here
  }
  return value.toFixed(2);         // TS knows it's number here
}

// 2. Truthiness narrowing
function printName(name: string | null | undefined): void {
  if (name) {
    console.log(name.toUpperCase()); // string (not null/undefined)
  } else {
    console.log("No name");
  }
}

// 3. Equality narrowing
function compare(a: string | number, b: string | boolean): void {
  if (a === b) {
    // Both must be string (only common type)
    console.log(a.toUpperCase()); // string
  }
}

// 4. instanceof narrowing
function formatDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString();    // Date
  }
  return value;                     // string
}

// 5. "in" narrowing
interface Cat { meow(): void; purr(): void }
interface Dog { bark(): void; fetch(): void }

function makeSound(animal: Cat | Dog): void {
  if ("meow" in animal) {
    animal.meow();    // Cat
  } else {
    animal.bark();    // Dog
  }
}

// ===== DISCRIMINATED UNIONS =====

// Best pattern for complex unions — use a common literal property

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}

console.log(area({ kind: "circle", radius: 5 }));          // 78.54
console.log(area({ kind: "rectangle", width: 4, height: 6 })); // 24

// Discriminated union for API responses
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string; code: number }
  | { status: "loading" };

function handleResponse(response: ApiResponse<string[]>): void {
  switch (response.status) {
    case "success":
      console.log(`Data: ${response.data.join(", ")}`);
      break;
    case "error":
      console.log(`Error ${response.code}: ${response.error}`);
      break;
    case "loading":
      console.log("Loading...");
      break;
  }
}

// ===== EXHAUSTIVENESS CHECKING =====

// never type catches missed cases at compile time
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

function getShapeColor(shape: Shape): string {
  switch (shape.kind) {
    case "circle": return "red";
    case "rectangle": return "blue";
    case "triangle": return "green";
    default:
      return assertNever(shape); // ❌ Compile error if a case is missing!
  }
}

// ===== TYPE PREDICATES (Custom Type Guards) =====

interface Fish { swim(): void; name: string }
interface Bird { fly(): void; name: string }

// Type predicate: "pet is Fish"
function isFish(pet: Fish | Bird): pet is Fish {
  return "swim" in pet;
}

function move2(pet: Fish | Bird): void {
  if (isFish(pet)) {
    pet.swim();     // Fish
  } else {
    pet.fly();      // Bird
  }
}

// Practical type guard
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNonNull<T>(value: T | null | undefined): value is T {
  return value != null;
}

// Filter with type guard
const values: (string | null)[] = ["hello", null, "world", null];
const strings: string[] = values.filter(isNonNull);
console.log(strings); // ["hello", "world"]

// ===== ASSERTION FUNCTIONS =====

function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== "number") {
    throw new Error(`Expected number, got ${typeof value}`);
  }
}

function processValue(input: unknown): void {
  assertIsNumber(input);
  // After assertion, TS knows input is number
  console.log(input.toFixed(2));
}

// ===== OPTIONAL CHAINING & NULLISH COALESCING =====

interface Company {
  name: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
  };
}

function getCity(company: Company): string {
  // Optional chaining (?.)
  const city = company.address?.city;

  // Nullish coalescing (??) — returns right side only for null/undefined
  return city ?? "Unknown";

  // Different from ||, which also catches "", 0, false:
  // "" ?? "default"  → ""         (keeps empty string)
  // "" || "default"  → "default"  (replaces empty string)
}

console.log("\n=== Unions & Narrowing ===");
console.log(`process("hello") = ${process("hello")}`);
console.log(`process(3.14159) = ${process(3.14159)}`);
console.log(`Strings: ${strings}`);

export {};
