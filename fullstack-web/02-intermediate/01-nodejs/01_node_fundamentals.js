// ============================================
// NODE.JS FUNDAMENTALS
// ============================================
// Node.js is a JavaScript runtime built on Chrome's V8 engine.
// It lets you run JavaScript outside the browser — on servers, CLIs, tools.

// ---- 1. WHAT IS NODE.JS? ----
// - JavaScript runtime (not a framework or language)
// - Event-driven, non-blocking I/O model
// - Single-threaded but handles concurrency via event loop
// - Package ecosystem: npm (largest in the world)

// Check version
// Run: node --version

// ---- 2. GLOBAL OBJECTS ----

// Node globals (different from browser)
console.log(__dirname);   // Current directory path
console.log(__filename);  // Current file path

// process — information about the running Node process
console.log(process.version);       // Node version
console.log(process.platform);      // "linux", "darwin", "win32"
console.log(process.cwd());         // Current working directory
console.log(process.env.HOME);      // Environment variable
console.log(process.argv);          // Command-line arguments

// process.exit(0); // Exit with success code
// process.exit(1); // Exit with error code

// setTimeout, setInterval, setImmediate (similar to browser)
setTimeout(() => console.log("After 1 second"), 1000);
setImmediate(() => console.log("Next iteration of event loop"));

// ---- 3. MODULES (CommonJS) ----

// Node uses CommonJS modules by default
// Export:
//   module.exports = { add, subtract };
//   module.exports = myFunction;
//   exports.add = function(a, b) { return a + b; };

// Import:
//   const { add, subtract } = require('./math');
//   const myModule = require('./myModule');

// Built-in modules (no install needed)
const os = require("os");
console.log("CPU cores:", os.cpus().length);
console.log("Total memory:", (os.totalmem() / 1e9).toFixed(1) + " GB");
console.log("Free memory:", (os.freemem() / 1e9).toFixed(1) + " GB");
console.log("Home dir:", os.homedir());
console.log("Platform:", os.platform());

// Using ES modules in Node (add "type": "module" to package.json)
// import { readFile } from 'fs/promises';
// import path from 'path';

// ---- 4. THE EVENT LOOP ----

// Node is single-threaded but handles async via the event loop
// Order of execution:
// 1. Synchronous code
// 2. Microtasks (Promise.then, process.nextTick)
// 3. Macrotasks (setTimeout, setInterval, I/O)

console.log("1. Synchronous");

setTimeout(() => console.log("4. setTimeout (macrotask)"), 0);
setImmediate(() => console.log("5. setImmediate"));

Promise.resolve().then(() => console.log("2. Promise (microtask)"));
process.nextTick(() => console.log("3. nextTick (microtask, higher priority)"));

// Output order: 1, 3, 2, 4, 5

// ---- 5. EVENTS (EventEmitter) ----

const EventEmitter = require("events");

class Logger extends EventEmitter {
  log(message) {
    console.log(`[LOG] ${message}`);
    this.emit("logged", { message, timestamp: new Date() });
  }

  error(message) {
    console.error(`[ERROR] ${message}`);
    this.emit("error", new Error(message));
  }
}

const logger = new Logger();

// Register listeners
logger.on("logged", (data) => {
  console.log("Event received:", data.message);
});

// Listen once
logger.once("logged", () => {
  console.log("This only fires once");
});

// Error listener (always add one!)
logger.on("error", (err) => {
  console.error("Caught:", err.message);
});

logger.log("Server started");
logger.log("User connected"); // "once" listener won't fire again

// ---- 6. BUFFERS AND STREAMS ----

// Buffer — raw binary data (for files, network, etc.)
const buf1 = Buffer.from("Hello, Node!");
console.log(buf1);              // <Buffer 48 65 6c ...>
console.log(buf1.toString());   // "Hello, Node!"
console.log(buf1.length);       // 12 bytes

const buf2 = Buffer.alloc(10);  // 10 bytes filled with zeros
buf2.write("Hi");
console.log(buf2.toString());   // "Hi" (+ null bytes)

// Streams — process data chunk by chunk (memory efficient)
const { Readable, Writable, Transform } = require("stream");

// Reading a large file as a stream
const fs = require("fs");
// const readStream = fs.createReadStream('large-file.txt', 'utf8');
// readStream.on('data', (chunk) => console.log('Chunk:', chunk.length));
// readStream.on('end', () => console.log('Done reading'));
// readStream.on('error', (err) => console.error(err));

// Pipe — connect streams
// readStream.pipe(writeStream);
// readStream.pipe(transformStream).pipe(writeStream);

// ---- 7. ERROR HANDLING IN NODE ----

// Synchronous errors — try/catch
try {
  JSON.parse("invalid json");
} catch (err) {
  console.error("Parse error:", err.message);
}

// Async errors — callbacks (error-first pattern)
// fs.readFile('missing.txt', (err, data) => {
//   if (err) { console.error(err.message); return; }
//   console.log(data);
// });

// Async errors — promises
// fs.promises.readFile('missing.txt')
//   .catch(err => console.error(err.message));

// Uncaught exceptions (last resort — log and exit)
process.on("uncaughtException", (err) => {
  console.error("Uncaught:", err.message);
  process.exit(1);
});

// Unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
  process.exit(1);
});

// ---- 8. ENVIRONMENT VARIABLES ----

// Access via process.env
// process.env.NODE_ENV   // "development" or "production"
// process.env.PORT       // Server port
// process.env.DB_URL     // Database connection string

// Set from command line:
// NODE_ENV=production PORT=3000 node app.js

// Using .env files (with dotenv package):
// require('dotenv').config();
// console.log(process.env.SECRET_KEY);

console.log("\nNode.js Fundamentals complete!");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create a module that exports add, subtract, multiply, divide functions
//    Import and use them in another file
// 2. Use the os module to display system information (CPUs, memory, uptime)
// 3. Create a custom EventEmitter class for a chat room
// 4. Read process.argv to create a simple CLI calculator: node calc.js 5 + 3
// 5. Demonstrate the event loop order with setTimeout, Promise, and nextTick
// 6. Create a simple timer that uses process.hrtime() to measure execution time
