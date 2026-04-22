// ============================================
// OPERATORS AND CONTROL FLOW
// ============================================

// ---- 1. ARITHMETIC OPERATORS ----

console.log("--- Arithmetic ---");
console.log(10 + 3);   // 13 (addition)
console.log(10 - 3);   // 7  (subtraction)
console.log(10 * 3);   // 30 (multiplication)
console.log(10 / 3);   // 3.3333... (division)
console.log(10 % 3);   // 1  (modulo — remainder)
console.log(2 ** 10);  // 1024 (exponentiation)

let count = 5;
count++;      // 6 (increment)
count--;      // 5 (decrement)
count += 10;  // 15 (addition assignment)
count -= 5;   // 10
count *= 2;   // 20
count /= 4;   // 5
count %= 3;   // 2

// ---- 2. COMPARISON OPERATORS ----

console.log("\n--- Comparison ---");
// == (loose equality — allows type coercion)
console.log(5 == "5");    // true  (string coerced to number)
console.log(0 == false);  // true
console.log(null == undefined); // true

// === (strict equality — no coercion, preferred!)
console.log(5 === "5");   // false (different types)
console.log(0 === false); // false
console.log(null === undefined); // false

console.log(5 != "5");    // false (loose inequality)
console.log(5 !== "5");   // true  (strict inequality — preferred!)

console.log(5 > 3);   // true
console.log(5 >= 5);  // true
console.log(3 < 5);   // true
console.log(3 <= 3);  // true

// Rule: ALWAYS use === and !== to avoid unexpected coercion

// ---- 3. LOGICAL OPERATORS ----

console.log("\n--- Logical ---");
console.log(true && true);   // true  (AND — both must be true)
console.log(true && false);  // false
console.log(true || false);  // true  (OR — at least one true)
console.log(false || false); // false
console.log(!true);          // false (NOT — flips the value)
console.log(!false);         // true

// Short-circuit evaluation
const user = null;
const userName = user && user.name;  // null (doesn't access .name)
const fallback = userName || "Guest"; // "Guest"
console.log(fallback);

// Nullish coalescing (??) — only null/undefined, not 0 or ""
const value1 = 0 || "default";    // "default" (0 is falsy)
const value2 = 0 ?? "default";    // 0 (0 is not null/undefined)
console.log(value1, value2);

// ---- 4. TERNARY OPERATOR ----

const age = 20;
const status = age >= 18 ? "adult" : "minor";
console.log(status); // "adult"

// Nested ternary (avoid for readability)
const category = age < 13 ? "child" : age < 18 ? "teen" : "adult";

// ---- 5. IF / ELSE IF / ELSE ----

console.log("\n--- if/else ---");

const score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B"); // This runs
} else if (score >= 70) {
  console.log("Grade: C");
} else if (score >= 60) {
  console.log("Grade: D");
} else {
  console.log("Grade: F");
}

// Single line (no braces needed for one statement, but braces recommended)
if (score >= 50) console.log("Passed!");

// ---- 6. SWITCH STATEMENT ----

console.log("\n--- switch ---");

const day = "Monday";

switch (day) {
  case "Monday":
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
  case "Friday":
    console.log("Weekday");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend");
    break;
  default:
    console.log("Invalid day");
}
// Note: switch uses === (strict equality)
// Don't forget break! Without it, execution falls through to next case.

// ---- 7. FOR LOOP ----

console.log("\n--- for loop ---");
for (let i = 0; i < 5; i++) {
  console.log(`Iteration ${i}`);
}

// Counting backwards
for (let i = 10; i > 0; i -= 2) {
  console.log(i); // 10, 8, 6, 4, 2
}

// ---- 8. WHILE AND DO-WHILE ----

console.log("\n--- while ---");
let counter = 0;
while (counter < 3) {
  console.log(`While: ${counter}`);
  counter++;
}

// do-while — runs at least once
let input;
do {
  input = "yes"; // Simulated input
  console.log("Do-while ran");
} while (input !== "yes");

// ---- 9. BREAK AND CONTINUE ----

console.log("\n--- break and continue ---");

// break — exit loop entirely
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i); // 0, 1, 2, 3, 4
}

// continue — skip current iteration
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue; // Skip even numbers
  console.log(i); // 1, 3, 5, 7, 9
}

// Labeled loops (for nested loops)
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outer;
    console.log(`${i},${j}`);
  }
}

// ---- 10. FOR...OF vs FOR...IN ----

console.log("\n--- for...of vs for...in ---");

const fruits = ["apple", "banana", "cherry"];

// for...of — iterates VALUES (use with arrays, strings, maps, sets)
for (const fruit of fruits) {
  console.log(fruit); // "apple", "banana", "cherry"
}

// for...in — iterates KEYS/indices (use with objects)
const person = { name: "Alice", age: 25, city: "NYC" };
for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}

// Don't use for...in with arrays (gives string indices, includes prototype)
// for (const i in fruits) { console.log(typeof i); } // "string" — surprising!

// Iterating a string
for (const char of "Hello") {
  console.log(char); // "H", "e", "l", "l", "o"
}

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. What's the difference between == and ===? Give 3 examples where they differ.
// 2. Write a grade calculator: input a score (0-100) and output A/B/C/D/F
// 3. Print all numbers from 1-100 that are divisible by both 3 and 5 (FizzBuzz)
// 4. Using a while loop, find the first power of 2 greater than 1000
// 5. Given an array of numbers, use for...of to sum only the odd numbers
// 6. Explain the difference between for...of and for...in
