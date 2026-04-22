// ============================================
// VARIABLES AND DATA TYPES
// ============================================

// ---- 1. DECLARING VARIABLES ----

// var — function-scoped, hoisted, can be redeclared (avoid in modern JS)
var oldWay = "I'm var";
var oldWay = "I can be redeclared"; // No error

// let — block-scoped, can be reassigned, cannot be redeclared
let score = 0;
score = 10; // OK — reassignment
// let score = 5; // Error — cannot redeclare

// const — block-scoped, cannot be reassigned or redeclared
const PI = 3.14159;
// PI = 3.14; // Error — cannot reassign

// const with objects/arrays — the reference is constant, not the contents
const user = { name: "Alice" };
user.name = "Bob"; // OK — modifying property
// user = {};       // Error — can't reassign reference

const numbers = [1, 2, 3];
numbers.push(4); // OK — modifying array contents
// numbers = [];   // Error — can't reassign reference

console.log("Rule: Use const by default, let when reassignment needed, avoid var");

// ---- 2. PRIMITIVE DATA TYPES (7 types) ----

// String
const greeting = "Hello, World!";
const name = 'Alice';
const template = `Hello, ${name}!`; // Template literal
console.log(typeof greeting); // "string"

// Number (integers and floats are the same type)
const integer = 42;
const float = 3.14;
const negative = -10;
const infinity = Infinity;
const notANumber = NaN;
console.log(typeof integer); // "number"
console.log(0.1 + 0.2);     // 0.30000000000000004 (floating point quirk!)

// BigInt — for very large integers
const bigNum = 9007199254740991n;
const anotherBig = BigInt("123456789012345678901234567890");
console.log(typeof bigNum); // "bigint"

// Boolean
const isActive = true;
const isLoggedIn = false;
console.log(typeof isActive); // "boolean"

// null — intentional absence of value
const emptyValue = null;
console.log(typeof emptyValue); // "object" (this is a known JS bug)

// undefined — variable declared but not assigned
let notAssigned;
console.log(notAssigned);       // undefined
console.log(typeof notAssigned); // "undefined"

// Symbol — unique identifier
const id = Symbol("id");
const anotherId = Symbol("id");
console.log(id === anotherId); // false — every Symbol is unique

// ---- 3. typeof OPERATOR ----

console.log("\n--- typeof examples ---");
console.log(typeof "hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" (historical bug)
console.log(typeof {});           // "object"
console.log(typeof []);           // "object" (arrays are objects)
console.log(typeof function(){}); // "function"
console.log(Array.isArray([]));   // true — use this to check arrays

// ---- 4. TYPE COERCION ----

// Implicit coercion (JS converts automatically — can be surprising)
console.log("\n--- Implicit coercion ---");
console.log("5" + 3);     // "53" (string concatenation wins with +)
console.log("5" - 3);     // 2   (- forces numeric conversion)
console.log("5" * 2);     // 10
console.log(true + 1);    // 2   (true = 1)
console.log(false + 1);   // 1   (false = 0)
console.log("" == false); // true (both coerce to 0)
console.log(null == undefined); // true (they're loosely equal)

// Explicit coercion (you convert intentionally — preferred!)
console.log("\n--- Explicit coercion ---");
console.log(Number("42"));      // 42
console.log(Number("hello"));   // NaN
console.log(Number(true));      // 1
console.log(Number(null));      // 0
console.log(Number(undefined)); // NaN

console.log(String(42));        // "42"
console.log(String(true));      // "true"
console.log(String(null));      // "null"

console.log(Boolean(0));        // false
console.log(Boolean(""));       // false
console.log(Boolean(null));     // false
console.log(Boolean(undefined));// false
console.log(Boolean(NaN));      // false
console.log(Boolean("hello"));  // true
console.log(Boolean(42));       // true
console.log(Boolean([]));       // true (empty array is truthy!)
console.log(Boolean({}));       // true (empty object is truthy!)

// parseInt and parseFloat
console.log(parseInt("42px"));      // 42
console.log(parseFloat("3.14abc")); // 3.14
console.log(parseInt("abc"));      // NaN

// ---- 5. TEMPLATE LITERALS ----

const firstName = "Alice";
const age = 25;

// String concatenation (old way)
console.log("Name: " + firstName + ", Age: " + age);

// Template literals (modern way — use backticks)
console.log(`Name: ${firstName}, Age: ${age}`);

// Expressions inside template literals
console.log(`In 5 years, ${firstName} will be ${age + 5}`);
console.log(`Is adult: ${age >= 18 ? "Yes" : "No"}`);

// Multi-line strings
const multiLine = `
  This is line 1
  This is line 2
  This is line 3
`;
console.log(multiLine);

// Tagged template literals (advanced)
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `**${values[i]}**` : "");
  }, "");
}
console.log(highlight`Hello ${firstName}, you are ${age} years old`);

// ---- 6. USEFUL STRING/NUMBER METHODS ----

const str = "Hello, World!";
console.log(str.length);           // 13
console.log(str.toUpperCase());    // "HELLO, WORLD!"
console.log(str.toLowerCase());    // "hello, world!"
console.log(str.includes("World"));// true
console.log(str.indexOf("World")); // 7
console.log(str.slice(0, 5));      // "Hello"
console.log(str.split(", "));      // ["Hello", "World!"]
console.log("  spaces  ".trim());  // "spaces"
console.log(str.replace("World", "JS")); // "Hello, JS!"

console.log(Number.isInteger(42));     // true
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isNaN(NaN));        // true
console.log((3.14159).toFixed(2));     // "3.14"
console.log(Math.floor(3.7));          // 3
console.log(Math.ceil(3.2));           // 4
console.log(Math.round(3.5));          // 4
console.log(Math.random());           // Random 0-1

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Declare variables for your name (const), age (const), and a counter (let).
//    Explain why you chose const or let for each.
// 2. What does typeof null return and why?
// 3. What's the result of: "10" + 5, "10" - 5, true + true, "" == false?
// 4. List all 6 falsy values in JavaScript
// 5. Use template literals to create a multi-line address string with variables
// 6. Convert the string "3.14" to a number in 3 different ways
