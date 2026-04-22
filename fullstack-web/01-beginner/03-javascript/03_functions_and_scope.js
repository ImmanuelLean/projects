// ============================================
// FUNCTIONS AND SCOPE
// ============================================

// ---- 1. FUNCTION DECLARATIONS ----

// Function declaration — hoisted (can be called before definition)
function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet("Alice")); // "Hello, Alice!"

// Function expression — NOT hoisted
const add = function (a, b) {
  return a + b;
};
console.log(add(3, 5)); // 8

// Arrow function (ES6)
const multiply = (a, b) => a * b;
console.log(multiply(4, 5)); // 20

// ---- 2. PARAMETERS ----

// Default parameters
function createUser(name, role = "viewer", active = true) {
  return { name, role, active };
}
console.log(createUser("Alice"));              // { name: "Alice", role: "viewer", active: true }
console.log(createUser("Bob", "admin"));       // { name: "Bob", role: "admin", active: true }

// Rest parameters (...) — collects remaining arguments into an array
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

function logFirst(first, ...rest) {
  console.log("First:", first);
  console.log("Rest:", rest);
}
logFirst("a", "b", "c"); // First: a, Rest: ["b", "c"]

// ---- 3. RETURN VALUES ----

// Functions without return give undefined
function noReturn() {
  console.log("I do something");
}
console.log(noReturn()); // undefined

// Returning multiple values (use an object or array)
function getMinMax(arr) {
  return {
    min: Math.min(...arr),
    max: Math.max(...arr),
  };
}
const { min, max } = getMinMax([3, 1, 7, 2, 9]);
console.log(min, max); // 1 9

// Early return pattern
function processAge(age) {
  if (age < 0) return "Invalid age";
  if (age < 18) return "Minor";
  return "Adult";
}

// ---- 4. SCOPE ----

// Global scope — accessible everywhere
const globalVar = "I'm global";

function demonstrateScope() {
  // Function scope — accessible only inside this function
  const functionVar = "I'm function-scoped";

  if (true) {
    // Block scope — accessible only inside this block
    const blockVar = "I'm block-scoped";
    let alsoBlock = "Me too";
    var notBlock = "var ignores block scope!";
    console.log(blockVar);  // OK
    console.log(globalVar); // OK — can access outer scopes
  }

  // console.log(blockVar); // Error — not accessible outside block
  console.log(notBlock);    // OK — var is function-scoped, not block-scoped
}
demonstrateScope();

// Scope chain — inner scopes can access outer scopes, not vice versa
function outer() {
  const outerVar = "outer";
  function inner() {
    const innerVar = "inner";
    console.log(outerVar); // OK — looks up the scope chain
  }
  inner();
  // console.log(innerVar); // Error — can't look down
}

// ---- 5. HOISTING ----

// Function declarations are fully hoisted
console.log(hoistedFunc()); // "I work!" — called before definition
function hoistedFunc() { return "I work!"; }

// var is hoisted but initialized as undefined
console.log(hoistedVar); // undefined (not an error, but not the value)
var hoistedVar = "I'm here";

// let/const are hoisted but NOT initialized (Temporal Dead Zone)
// console.log(tdzVar); // ReferenceError: Cannot access before initialization
// let tdzVar = "hello";

// ---- 6. CLOSURES ----
// A closure is a function that remembers its outer scope even after the outer function returns.

function createCounter() {
  let count = 0; // This variable is "closed over"
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1
// count is private — can't be accessed directly

// Closure: function factory
function createMultiplier(factor) {
  return (number) => number * factor;
}
const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(double(5));  // 10
console.log(triple(5));  // 15

// Closure: memoization
function memoize(fn) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      console.log("From cache");
      return cache[key];
    }
    cache[key] = fn(...args);
    return cache[key];
  };
}

const expensiveCalc = memoize((n) => {
  console.log("Computing...");
  return n * n;
});
console.log(expensiveCalc(5)); // Computing... 25
console.log(expensiveCalc(5)); // From cache 25

// Common closure pitfall with var in loops
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var loop:", i), 100); // 3, 3, 3
}
// Fix: use let (block-scoped)
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let loop:", j), 200); // 0, 1, 2
}

// ---- 7. IIFE (Immediately Invoked Function Expression) ----

(function () {
  const secret = "hidden";
  console.log("IIFE executed, secret:", secret);
})();
// console.log(secret); // Error — not accessible outside

// IIFE with arrow function
(() => {
  console.log("Arrow IIFE");
})();

// IIFE returning a value
const result = (() => {
  const x = 10;
  const y = 20;
  return x + y;
})();
console.log("IIFE result:", result); // 30

// ---- 8. CALLBACK FUNCTIONS ----

function doSomething(callback) {
  console.log("Doing something...");
  callback("done");
}
doSomething((status) => console.log("Status:", status));

// Array methods use callbacks
const nums = [1, 2, 3, 4, 5];
const doubled = nums.map((n) => n * 2);
const evens = nums.filter((n) => n % 2 === 0);
console.log(doubled); // [2, 4, 6, 8, 10]
console.log(evens);   // [2, 4]

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Write a function that takes any number of arguments and returns their average
// 2. Create a function createGreeter(greeting) that returns a function taking a name
//    e.g., createGreeter("Hi")("Alice") => "Hi, Alice!"
// 3. Implement a simple once() function that ensures a function can only be called once
// 4. Explain why var in a for loop with setTimeout prints the same value
// 5. Write a memoized fibonacci function using closures
// 6. What is the Temporal Dead Zone? Give an example.
