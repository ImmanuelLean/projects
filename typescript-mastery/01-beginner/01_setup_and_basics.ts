// ============================================
// TYPESCRIPT: SETUP & BASICS
// ============================================
// Install: npm install -g typescript
// Compile: tsc filename.ts
// Run:     npx ts-node filename.ts (npm install -g ts-node)

// ===== SETUP =====
// Initialize a project:
//   mkdir my-project && cd my-project
//   npm init -y
//   npm install -D typescript ts-node @types/node
//   npx tsc --init   ← creates tsconfig.json

// ===== TYPE ANNOTATIONS =====

// Primitives
let name1: string = "Alice";
let age: number = 30;
let isActive: boolean = true;
let big: bigint = 100n;
let sym: symbol = Symbol("id");

// Type inference — TS figures out the type automatically
let city = "New York";       // inferred as string
let count = 42;              // inferred as number
// city = 123;               // ❌ Error: Type 'number' is not assignable to type 'string'

// ===== SPECIAL TYPES =====

// any — disables type checking (avoid!)
let anything: any = "hello";
anything = 42;               // no error, but defeats the purpose of TS

// unknown — safer than any (must check type before using)
let mystery: unknown = "hello";
// mystery.toUpperCase();    // ❌ Error: Object is of type 'unknown'
if (typeof mystery === "string") {
  console.log(mystery.toUpperCase()); // ✅ After type check
}

// void — function returns nothing
function logMessage(msg: string): void {
  console.log(msg);
}

// null and undefined
let nothing: null = null;
let notDefined: undefined = undefined;

// never — function never returns (throws or infinite loop)
function throwError(msg: string): never {
  throw new Error(msg);
}

function infiniteLoop(): never {
  while (true) {}
}

// ===== VARIABLES =====

// const infers literal types
const direction = "north";    // type is "north", not string
let direction2 = "north";     // type is string

// Type assertion (when you know more than TS)
const input = document.getElementById("name") as HTMLInputElement;
// or: const input = <HTMLInputElement>document.getElementById("name");

// Non-null assertion (!) — tells TS it's not null/undefined
const element = document.getElementById("app")!;

// ===== TEMPLATE LITERAL TYPES =====
let greeting: `Hello, ${string}` = "Hello, World";
// greeting = "Hi, World";   // ❌ Error

// ===== TYPE vs VALUE =====
// Types exist only at compile time — erased in JavaScript output
// Values exist at runtime

console.log("\n=== Type Annotations ===");
console.log(`name: ${name1} (${typeof name1})`);
console.log(`age: ${age} (${typeof age})`);
console.log(`isActive: ${isActive} (${typeof isActive})`);

// ===== STRICT MODE =====
// tsconfig.json: "strict": true enables ALL strict checks:
//   strictNullChecks     — null/undefined are separate types
//   strictFunctionTypes  — stricter function type checking
//   strictBindCallApply  — check bind/call/apply arguments
//   noImplicitAny        — error on implicit 'any'
//   noImplicitThis       — error on implicit 'this'
//   alwaysStrict         — emit "use strict"
// ALWAYS use strict mode! It catches the most bugs.

export {};
