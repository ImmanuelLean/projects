// ============================================
// ARRAYS, TUPLES & COLLECTIONS
// ============================================

// ===== ARRAY TYPES =====

// Two syntaxes (identical)
const numbers: number[] = [1, 2, 3, 4, 5];
const names: Array<string> = ["Alice", "Bob", "Charlie"];

// Mixed arrays need union types
const mixed: (string | number)[] = [1, "hello", 2, "world"];

// Array of objects
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const todos: Todo[] = [
  { id: 1, title: "Learn TypeScript", completed: false },
  { id: 2, title: "Build project", completed: false },
];

// Readonly arrays
const frozen: readonly number[] = [1, 2, 3];
// frozen.push(4);     // ❌ Error: Property 'push' does not exist on readonly number[]
// frozen[0] = 99;     // ❌ Error

const alsoFrozen: ReadonlyArray<string> = ["a", "b", "c"];

// ===== TYPED ARRAY METHODS =====

// map — type is inferred
const doubled = numbers.map((n) => n * 2);         // number[]
const strings = numbers.map((n) => String(n));       // string[]
const objects = numbers.map((n) => ({ value: n }));  // { value: number }[]

// filter — narrowing with type predicate
const mixedValues: (string | number | null)[] = [1, "hello", null, 2, "world", null];

// Without type predicate: still (string | number | null)[]
const noNulls1 = mixedValues.filter((v) => v !== null);

// With type predicate: properly narrowed!
function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}
const noNulls2 = mixedValues.filter(isNotNull); // (string | number)[]

// reduce — must specify accumulator type sometimes
const total = numbers.reduce((sum, n) => sum + n, 0);  // number
const grouped = todos.reduce<Record<string, Todo[]>>((acc, todo) => {
  const key = todo.completed ? "done" : "pending";
  acc[key] = acc[key] || [];
  acc[key].push(todo);
  return acc;
}, {});

// find — returns T | undefined
const found = todos.find((t) => t.id === 1);
// found?.title;  // must handle undefined

// ===== TUPLES =====

// Fixed-length array with specific types per position
type Coordinate = [number, number];
const point: Coordinate = [10, 20];
const x = point[0]; // number
const y = point[1]; // number
// point[2];        // ❌ Error: Tuple type has no element at index '2'

// Named tuples (documentation only, no runtime effect)
type NameAge = [name: string, age: number];
const person: NameAge = ["Alice", 30];

// Tuple with optional element
type OptionalTuple = [string, number, boolean?];
const t1: OptionalTuple = ["hello", 42];
const t2: OptionalTuple = ["hello", 42, true];

// Tuple with rest
type StringNumberRest = [string, ...number[]];
const data: StringNumberRest = ["scores", 90, 85, 95, 88];

// Readonly tuple
const readonly_tuple: readonly [string, number] = ["Alice", 30];
// readonly_tuple[0] = "Bob"; // ❌ Error

// ===== TUPLE USE CASES =====

// Return multiple values from function
function divide(a: number, b: number): [number, number] {
  return [Math.floor(a / b), a % b]; // [quotient, remainder]
}
const [quotient, remainder] = divide(10, 3);
console.log(`10 / 3 = ${quotient} remainder ${remainder}`);

// React-style useState
function useState<T>(initial: T): [T, (value: T) => void] {
  let state = initial;
  const setState = (value: T) => { state = value; };
  return [state, setState];
}
const [count, setCount] = useState(0);

// Key-value pair
type Entry = [key: string, value: unknown];
const entries: Entry[] = [
  ["name", "Alice"],
  ["age", 30],
  ["active", true],
];

// ===== CONST ASSERTIONS =====

// as const makes arrays readonly tuples with literal types
const colors = ["red", "green", "blue"] as const;
// type: readonly ["red", "green", "blue"]
// colors[0] is type "red", not string

type Color = (typeof colors)[number]; // "red" | "green" | "blue"

const config = {
  host: "localhost",
  port: 3000,
  debug: true,
} as const;
// All properties are readonly with literal types

// ===== MAPS AND SETS =====

// Map
const userMap = new Map<number, string>();
userMap.set(1, "Alice");
userMap.set(2, "Bob");
const userName = userMap.get(1); // string | undefined

// Set
const uniqueIds = new Set<number>([1, 2, 3, 2, 1]);
uniqueIds.add(4);
console.log(uniqueIds.size); // 4

// WeakMap / WeakSet (keys must be objects)
const cache = new WeakMap<object, string>();

console.log("\n=== Arrays & Tuples ===");
console.log(`Numbers: ${numbers}`);
console.log(`Point: (${point[0]}, ${point[1]})`);
console.log(`Colors: ${colors.join(", ")}`);
console.log(`Divide 10/3: ${quotient}r${remainder}`);

export {};
