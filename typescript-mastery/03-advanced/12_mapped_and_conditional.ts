// ============================================
// MAPPED TYPES & CONDITIONAL TYPES
// ============================================

// ===== MAPPED TYPES =====

// Transform every property in a type
type Readonly2<T> = { readonly [K in keyof T]: T[K] };
type Optional<T> = { [K in keyof T]?: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Mutable<T> = { -readonly [K in keyof T]: T[K] };   // remove readonly
type Required2<T> = { [K in keyof T]-?: T[K] };           // remove optional

interface User {
  id: number;
  name: string;
  email: string;
}

type NullableUser = Nullable<User>;
// { id: number | null; name: string | null; email: string | null }

// Key remapping (as clause)
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string; getEmail: () => string }

// Filter keys
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

interface Mixed {
  name: string;
  age: number;
  email: string;
  active: boolean;
}

type StringProps = OnlyStrings<Mixed>;
// { name: string; email: string }

// Event handler map
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

type UserHandlers = EventHandlers<User>;
// { onIdChange: (value: number) => void; onNameChange: ... }

// ===== CONDITIONAL TYPES =====

// T extends U ? TrueType : FalseType

type IsString<T> = T extends string ? true : false;

type A = IsString<string>;   // true
type B = IsString<number>;   // false
type C = IsString<"hello">;  // true

// Practical conditional types
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends Function ? "function" :
  T extends undefined ? "undefined" :
  "object";

type T1 = TypeName<string>;     // "string"
type T2 = TypeName<42>;         // "number"
type T3 = TypeName<() => void>; // "function"

// ===== INFER KEYWORD =====

// Extract types from other types
type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never;

type R1 = ReturnOf<() => string>;              // string
type R2 = ReturnOf<(x: number) => boolean>;    // boolean

// Extract element type from array
type ElementOf<T> = T extends (infer E)[] ? E : never;

type E1 = ElementOf<string[]>;     // string
type E2 = ElementOf<number[]>;     // number
type E3 = ElementOf<(string | number)[]>; // string | number

// Extract Promise value
type Unwrap<T> = T extends Promise<infer V> ? Unwrap<V> : T;

type P1 = Unwrap<Promise<string>>;           // string
type P2 = Unwrap<Promise<Promise<number>>>;  // number

// Extract function parameters
type FirstParam<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never;

type FP1 = FirstParam<(name: string, age: number) => void>; // string

// ===== DISTRIBUTIVE CONDITIONAL TYPES =====

// When T is a union, conditional distributes over each member
type ToArray<T> = T extends any ? T[] : never;

type Distributed = ToArray<string | number>;
// string[] | number[]  (NOT (string | number)[])

// Prevent distribution with [T]
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type NonDist = ToArrayNonDist<string | number>;
// (string | number)[]

// ===== TEMPLATE LITERAL TYPES =====

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type APIPath = "/users" | "/posts" | "/comments";
type Endpoint = `${HTTPMethod} ${APIPath}`;
// 12 combinations: "GET /users" | "GET /posts" | ... | "DELETE /comments"

// Type-safe CSS
type CSSUnit = "px" | "rem" | "em" | "%" | "vh" | "vw";
type CSSValue = `${number}${CSSUnit}`;

const width: CSSValue = "100px";     // ✅
const height: CSSValue = "50vh";     // ✅
// const bad: CSSValue = "large";    // ❌

// Extract parts from template literals
type ExtractRouteParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
      ? Param
      : never;

type Params = ExtractRouteParams<"/users/:userId/posts/:postId">;
// "userId" | "postId"

// ===== PRACTICAL: DEEP READONLY =====

type DeepReadonly<T> =
  T extends (infer E)[]
    ? readonly DeepReadonly<E>[]
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

interface Config {
  server: {
    host: string;
    port: number;
    ssl: { enabled: boolean; cert: string };
  };
  features: string[];
}

type FrozenConfig = DeepReadonly<Config>;
// All nested properties are readonly

// ===== PRACTICAL: DEEP PARTIAL =====

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

type PartialConfig = DeepPartial<Config>;
// All nested properties are optional

function mergeConfig(base: Config, overrides: DeepPartial<Config>): Config {
  return { ...base, ...overrides } as Config;
}

// ===== PRACTICAL: PATH TYPES =====

type PathKeys<T, Prefix extends string = ""> =
  T extends object
    ? {
        [K in keyof T & string]:
          | `${Prefix}${K}`
          | PathKeys<T[K], `${Prefix}${K}.`>
      }[keyof T & string]
    : never;

type ConfigPaths = PathKeys<Config>;
// "server" | "server.host" | "server.port" | "server.ssl" | "server.ssl.enabled" | ...

console.log("\n=== Mapped & Conditional Types ===");
console.log("These types exist only at compile time — no runtime output");
console.log("Check the type definitions in your IDE for the magic!");

export {};
