// ============================================
// ARRAYS
// ============================================

// ---- 1. CREATING AND ACCESSING ARRAYS ----

const fruits = ["apple", "banana", "cherry", "date"];
const mixed = [1, "hello", true, null, { key: "val" }, [1, 2]];
const empty = [];
const filled = new Array(5).fill(0); // [0, 0, 0, 0, 0]

console.log(fruits[0]);          // "apple" (zero-indexed)
console.log(fruits[fruits.length - 1]); // "date" (last element)
console.log(fruits.at(-1));      // "date" (modern: negative indexing)
console.log(fruits.at(-2));      // "cherry"

fruits[1] = "blueberry";        // Modify element
console.log(fruits.length);      // 4

// ---- 2. ADDING AND REMOVING ELEMENTS ----

const arr = [1, 2, 3, 4, 5];

// End of array
arr.push(6);         // Add to end → [1,2,3,4,5,6], returns new length
arr.pop();           // Remove from end → [1,2,3,4,5], returns removed (6)

// Beginning of array
arr.unshift(0);      // Add to beginning → [0,1,2,3,4,5]
arr.shift();         // Remove from beginning → [1,2,3,4,5], returns removed (0)

// Anywhere: splice(startIndex, deleteCount, ...itemsToAdd)
const colors = ["red", "green", "blue", "yellow"];
colors.splice(1, 1);           // Remove 1 at index 1 → ["red", "blue", "yellow"]
colors.splice(1, 0, "orange"); // Insert at index 1 → ["red", "orange", "blue", "yellow"]
colors.splice(2, 1, "purple"); // Replace at index 2 → ["red", "orange", "purple", "yellow"]
console.log(colors);

// slice(start, end) — returns copy, doesn't modify original
const nums = [1, 2, 3, 4, 5];
console.log(nums.slice(1, 3));  // [2, 3] (end is exclusive)
console.log(nums.slice(-2));    // [4, 5]
console.log(nums.slice());     // [1, 2, 3, 4, 5] (shallow copy)

// ---- 3. SEARCHING ----

const items = [10, 20, 30, 20, 40];

console.log(items.indexOf(20));      // 1 (first occurrence)
console.log(items.lastIndexOf(20));  // 3 (last occurrence)
console.log(items.includes(30));     // true
console.log(items.includes(50));     // false

// ---- 4. ITERATION METHODS ----

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// forEach — execute function for each element (no return value)
numbers.forEach((num, index) => {
  // console.log(`Index ${index}: ${num}`);
});

// map — transform each element, returns new array
const doubled = numbers.map((n) => n * 2);
console.log("map:", doubled); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// filter — keep elements that pass a test
const evens = numbers.filter((n) => n % 2 === 0);
console.log("filter:", evens); // [2, 4, 6, 8, 10]

// reduce — accumulate values into a single result
const sum = numbers.reduce((accumulator, current) => accumulator + current, 0);
console.log("reduce sum:", sum); // 55

// reduce to find max
const maxVal = numbers.reduce((max, n) => (n > max ? n : max), -Infinity);
console.log("reduce max:", maxVal); // 10

// reduce to group by
const people = [
  { name: "Alice", dept: "Engineering" },
  { name: "Bob", dept: "Marketing" },
  { name: "Charlie", dept: "Engineering" },
  { name: "Diana", dept: "Marketing" },
];

const byDept = people.reduce((groups, person) => {
  const dept = person.dept;
  groups[dept] = groups[dept] || [];
  groups[dept].push(person.name);
  return groups;
}, {});
console.log("Grouped:", byDept);

// find — return first element that passes test (or undefined)
const firstEven = numbers.find((n) => n % 2 === 0);
console.log("find:", firstEven); // 2

// findIndex — return index of first matching element (or -1)
const firstEvenIdx = numbers.findIndex((n) => n % 2 === 0);
console.log("findIndex:", firstEvenIdx); // 1

// some — does ANY element pass the test?
console.log("some > 5:", numbers.some((n) => n > 5));   // true
console.log("some > 20:", numbers.some((n) => n > 20)); // false

// every — do ALL elements pass the test?
console.log("every > 0:", numbers.every((n) => n > 0));  // true
console.log("every > 5:", numbers.every((n) => n > 5));  // false

// flat — flatten nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];
console.log(nested.flat());    // [1, 2, 3, 4, [5, 6]]
console.log(nested.flat(2));   // [1, 2, 3, 4, 5, 6]
console.log(nested.flat(Infinity)); // Flatten all levels

// flatMap — map + flat(1)
const sentences = ["Hello World", "Foo Bar"];
const words = sentences.flatMap((s) => s.split(" "));
console.log(words); // ["Hello", "World", "Foo", "Bar"]

// ---- 5. SORTING ----

const unsorted = [3, 1, 4, 1, 5, 9, 2, 6];

// sort() mutates the original array! Use toSorted() for a copy
const sorted = [...unsorted].sort((a, b) => a - b); // Ascending
console.log("Ascending:", sorted);

const descending = [...unsorted].sort((a, b) => b - a);
console.log("Descending:", descending);

// Sorting strings
const names = ["Charlie", "alice", "Bob"];
names.sort((a, b) => a.localeCompare(b)); // Case-insensitive
console.log("Names:", names);

// Sorting objects
const users = [
  { name: "Charlie", age: 30 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 35 },
];
users.sort((a, b) => a.age - b.age);
console.log("By age:", users);

// reverse() — also mutates!
const reversed = [...numbers].reverse();

// ---- 6. SPREAD OPERATOR AND DESTRUCTURING ----

// Spread — expand array elements
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];     // [1, 2, 3, 4, 5, 6]
const copy = [...arr1];                  // Shallow copy
const withExtra = [0, ...arr1, 7];       // [0, 1, 2, 3, 7]

// Destructuring — extract values into variables
const [first, second, ...rest] = [10, 20, 30, 40, 50];
console.log(first);  // 10
console.log(second); // 20
console.log(rest);   // [30, 40, 50]

// Skipping elements
const [, , third] = [1, 2, 3];
console.log(third); // 3

// Default values
const [a = 0, b = 0, c = 0] = [1, 2];
console.log(a, b, c); // 1 2 0

// Swap variables
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2 1

// ---- 7. OTHER USEFUL METHODS ----

console.log([1, 2, 3].join(" - "));    // "1 - 2 - 3"
console.log(Array.from("hello"));       // ["h", "e", "l", "l", "o"]
console.log(Array.from({ length: 5 }, (_, i) => i * 2)); // [0, 2, 4, 6, 8]
console.log(Array.isArray([1, 2]));     // true
console.log([1, 2, 3].concat([4, 5])); // [1, 2, 3, 4, 5]

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Given [1,2,3,4,5,6,7,8,9,10], use filter+map to get doubled values of odds only
// 2. Use reduce to count occurrences of each word in ["apple","banana","apple","cherry","banana","apple"]
// 3. Flatten [[1,2],[3,[4,5]],[6]] completely and find the sum
// 4. Sort [{name:"Zoe",score:85},{name:"Amy",score:92},{name:"Max",score:78}] by score desc
// 5. Implement a function removeDuplicates(arr) without using Set
// 6. Use destructuring to swap two variables and extract the first and last from an array
