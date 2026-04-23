// ============================================
// ENUMS & SPECIAL TYPES
// ============================================

// ===== NUMERIC ENUM =====
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right,   // 3
}

const dir: Direction = Direction.Up;
console.log(dir);                    // 0
console.log(Direction[0]);           // "Up" (reverse mapping)

// Custom values
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalError = 500,
}

function handleStatus(status: HttpStatus): string {
  switch (status) {
    case HttpStatus.OK: return "Success";
    case HttpStatus.NotFound: return "Not Found";
    case HttpStatus.InternalError: return "Server Error";
    default: return "Unknown";
  }
}

// ===== STRING ENUM =====
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

// No reverse mapping for string enums
console.log(Color.Red); // "RED"

// ===== CONST ENUM (inlined at compile time) =====
const enum Priority {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
  Urgent = "URGENT",
}

const taskPriority = Priority.High; // compiled to just "HIGH"

// ===== ENUM ALTERNATIVES (often preferred) =====

// 1. Union of literals (most common alternative)
type StatusType = "active" | "inactive" | "pending";

// 2. Object as const
const Roles = {
  Admin: "admin",
  User: "user",
  Guest: "guest",
} as const;

type RoleType = (typeof Roles)[keyof typeof Roles]; // "admin" | "user" | "guest"

// Why prefer unions over enums?
// - Simpler, no runtime overhead
// - Better tree-shaking
// - Works with type narrowing
// - No confusing numeric reverse mapping

// ===== SATISFIES OPERATOR (TS 4.9+) =====

// Validates type WITHOUT widening
type ColorMap = Record<string, [number, number, number] | string>;

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies ColorMap;

// palette.red is [number, number, number], not string | [number, number, number]
const redValue = palette.red[0]; // ✅ number (precise type preserved)

// Without satisfies:
const palette2: ColorMap = { red: [255, 0, 0], green: "#00ff00" };
// palette2.red[0]; // ❌ Error: might be string

// ===== TYPEOF =====

// Get type from a value
const serverConfig = {
  host: "localhost",
  port: 3000,
  debug: true,
};

type ServerConfig = typeof serverConfig;
// { host: string; port: number; debug: boolean }

// Useful with as const
const routes = ["home", "about", "contact"] as const;
type Route = (typeof routes)[number]; // "home" | "about" | "contact"

// ===== KEYOF =====

interface User {
  id: number;
  name: string;
  email: string;
}

type UserKey = keyof User; // "id" | "name" | "email"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: "Alice", email: "a@b.com" };
const name1 = getProperty(user, "name"); // string
const id = getProperty(user, "id");      // number
// getProperty(user, "foo");             // ❌ Error

// ===== INDEXED ACCESS TYPES =====

type UserName = User["name"];     // string
type UserIdOrName = User["id" | "name"]; // number | string

// With arrays
const fruits = ["apple", "banana", "cherry"] as const;
type Fruit = (typeof fruits)[number]; // "apple" | "banana" | "cherry"

// Nested access
interface ApiResponse {
  data: {
    users: User[];
    total: number;
  };
  status: number;
}

type Users = ApiResponse["data"]["users"];     // User[]
type SingleUser = ApiResponse["data"]["users"][number]; // User

// ===== TEMPLATE LITERAL TYPES =====

type EventName = "click" | "scroll" | "mousemove";
type EventHandler = `on${Capitalize<EventName>}`; // "onClick" | "onScroll" | "onMousemove"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiPath = `/api/${"users" | "posts" | "comments"}`;
type Endpoint = `${HttpMethod} ${ApiPath}`;
// "GET /api/users" | "GET /api/posts" | ... (12 combinations)

// Intrinsic string manipulation types
type Upper = Uppercase<"hello">;      // "HELLO"
type Lower = Lowercase<"HELLO">;      // "hello"
type Cap = Capitalize<"hello">;       // "Hello"
type Uncap = Uncapitalize<"Hello">;   // "hello"

console.log("\n=== Enums & Special Types ===");
console.log(`Direction.Up = ${Direction.Up}`);
console.log(`HttpStatus.OK = ${HttpStatus.OK}`);
console.log(`Color.Red = ${Color.Red}`);
console.log(`Role: ${Roles.Admin}`);
console.log(`User name: ${getProperty(user, "name")}`);

export {};
