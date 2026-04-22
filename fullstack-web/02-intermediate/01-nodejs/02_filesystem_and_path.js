// ============================================
// NODE.JS FILESYSTEM AND PATH
// ============================================

const fs = require("fs");
const fsp = require("fs/promises"); // Promise-based API (preferred)
const path = require("path");

// ---- 1. PATH MODULE ----

// path.join — joins path segments (handles separators cross-platform)
const filePath = path.join(__dirname, "data", "users.json");
console.log("join:", filePath);

// path.resolve — resolves to absolute path
console.log("resolve:", path.resolve("src", "index.js"));

// Path parts
console.log("dirname:", path.dirname("/home/user/app/index.js"));   // /home/user/app
console.log("basename:", path.basename("/home/user/app/index.js")); // index.js
console.log("basename no ext:", path.basename("index.js", ".js"));  // index
console.log("extname:", path.extname("photo.jpg"));                 // .jpg

// path.parse and path.format
const parsed = path.parse("/home/user/docs/file.txt");
console.log(parsed);
// { root: '/', dir: '/home/user/docs', base: 'file.txt', ext: '.txt', name: 'file' }

console.log(path.format({ dir: "/home/user", base: "file.txt" }));
// /home/user/file.txt

// Normalize messy paths
console.log(path.normalize("/home//user/../user/./docs"));
// /home/user/docs

// Check if absolute
console.log(path.isAbsolute("/home/user")); // true
console.log(path.isAbsolute("./src"));      // false

// ---- 2. READING FILES ----

// Async (Promise) — PREFERRED
async function readFileAsync() {
  try {
    const data = await fsp.readFile(
      path.join(__dirname, "example.txt"),
      "utf8"
    );
    console.log("File content:", data);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("File not found");
    } else {
      throw err;
    }
  }
}

// Callback style
fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) return console.error(err.message);
  console.log(data);
});

// Synchronous (blocks event loop — avoid in servers)
// const data = fs.readFileSync('example.txt', 'utf8');

// Reading JSON
async function readJSON(filepath) {
  const raw = await fsp.readFile(filepath, "utf8");
  return JSON.parse(raw);
}

// ---- 3. WRITING FILES ----

async function writeExamples() {
  const dataDir = path.join(__dirname, "data");

  // Create directory if it doesn't exist
  await fsp.mkdir(dataDir, { recursive: true });

  // Write file (creates or overwrites)
  await fsp.writeFile(
    path.join(dataDir, "output.txt"),
    "Hello, Node.js!\nSecond line.",
    "utf8"
  );

  // Append to file
  await fsp.appendFile(
    path.join(dataDir, "log.txt"),
    `[${new Date().toISOString()}] App started\n`
  );

  // Write JSON
  const config = { port: 3000, debug: true, db: "postgres://localhost/mydb" };
  await fsp.writeFile(
    path.join(dataDir, "config.json"),
    JSON.stringify(config, null, 2)
  );

  console.log("Files written!");
}

// ---- 4. WORKING WITH DIRECTORIES ----

async function directoryOps() {
  // Create directory (recursive: true creates parents too)
  await fsp.mkdir(path.join(__dirname, "a", "b", "c"), { recursive: true });

  // Read directory contents
  const entries = await fsp.readdir(__dirname);
  console.log("Directory contents:", entries);

  // Read with file types
  const detailed = await fsp.readdir(__dirname, { withFileTypes: true });
  for (const entry of detailed) {
    const type = entry.isDirectory() ? "DIR" : "FILE";
    console.log(`${type}: ${entry.name}`);
  }

  // Remove directory
  // await fsp.rmdir(path.join(__dirname, 'empty-dir'));
  // await fsp.rm(path.join(__dirname, 'dir'), { recursive: true, force: true });
}

// ---- 5. FILE OPERATIONS ----

async function fileOps() {
  // Check if file exists
  try {
    await fsp.access("example.txt");
    console.log("File exists");
  } catch {
    console.log("File does not exist");
  }

  // File stats (metadata)
  try {
    const stats = await fsp.stat(__filename);
    console.log("Size:", stats.size, "bytes");
    console.log("Created:", stats.birthtime);
    console.log("Modified:", stats.mtime);
    console.log("Is file:", stats.isFile());
    console.log("Is dir:", stats.isDirectory());
  } catch (err) {
    console.error(err.message);
  }

  // Copy file
  // await fsp.copyFile('source.txt', 'dest.txt');

  // Rename / Move file
  // await fsp.rename('old.txt', 'new.txt');

  // Delete file
  // await fsp.unlink('unwanted.txt');
}

// ---- 6. STREAMS FOR LARGE FILES ----

function copyLargeFile(src, dest) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(src);
    const writeStream = fs.createWriteStream(dest);

    readStream.pipe(writeStream);

    writeStream.on("finish", resolve);
    readStream.on("error", reject);
    writeStream.on("error", reject);
  });
}

// Line-by-line reading (for large files)
const readline = require("readline");

async function readLines(filepath) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filepath),
    crlfDelay: Infinity,
  });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    console.log(`Line ${lineNum}: ${line}`);
  }
}

// ---- 7. WATCHING FILES ----

// Watch for file changes (useful for dev servers)
// const watcher = fs.watch(__dirname, (eventType, filename) => {
//   console.log(`${eventType}: ${filename}`);
// });
// watcher.close(); // Stop watching

// Watch specific file
// fs.watchFile('config.json', (curr, prev) => {
//   console.log('Config changed!');
//   console.log('Previous mtime:', prev.mtime);
//   console.log('Current mtime:', curr.mtime);
// });

// ---- 8. RECURSIVE DIRECTORY WALK ----

async function walkDir(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

// Usage: const allFiles = await walkDir('/home/user/project');

// Modern alternative (Node 18.17+)
// const files = await fsp.readdir(dir, { recursive: true });

console.log("\nFilesystem & Path module complete!");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Write a script that reads a JSON config file, modifies a value, and saves it back
// 2. Create a function that recursively lists all .js files in a directory tree
// 3. Build a simple file logger: log(message) appends timestamped lines to a file
// 4. Copy all files from one directory to another, preserving structure
// 5. Read a CSV file line by line and convert it to an array of objects
// 6. Watch a directory and log whenever a file is added, changed, or deleted
