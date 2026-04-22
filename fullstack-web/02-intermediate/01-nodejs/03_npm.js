// ============================================
// NPM (Node Package Manager)
// ============================================

// ---- 1. INITIALIZING A PROJECT ----

// Create package.json (interactive)
// npm init

// Create with defaults (no questions)
// npm init -y

// package.json is the project manifest:
const packageJsonExample = {
  name: "my-app",
  version: "1.0.0",
  description: "A sample Node.js app",
  main: "src/index.js",          // Entry point
  type: "module",                 // Use ES modules (import/export)
  scripts: {
    start: "node src/index.js",
    dev: "nodemon src/index.js",
    test: "jest",
    build: "tsc",
    lint: "eslint src/",
  },
  keywords: ["nodejs", "tutorial"],
  author: "Your Name",
  license: "MIT",
  dependencies: {},               // Production dependencies
  devDependencies: {},            // Development-only dependencies
};

// ---- 2. INSTALLING PACKAGES ----

// Install production dependency
// npm install express                 # or: npm i express
// npm install express mongoose dotenv # Multiple packages

// Install dev dependency
// npm install --save-dev nodemon jest # or: npm i -D nodemon jest

// Install globally (CLI tools)
// npm install -g nodemon typescript

// Install specific version
// npm install express@4.18.2
// npm install express@^4.0.0     # Compatible with 4.x.x
// npm install express@~4.18.0    # Patch updates only ~4.18.x

// Install from package.json (when cloning a project)
// npm install                    # Installs all dependencies

// ---- 3. SEMANTIC VERSIONING ----

// Version format: MAJOR.MINOR.PATCH
// MAJOR: Breaking changes       (2.0.0 → 3.0.0)
// MINOR: New features, backward compatible (2.1.0 → 2.2.0)
// PATCH: Bug fixes              (2.1.0 → 2.1.1)

// Version ranges in package.json:
// "^4.18.2"  → >=4.18.2, <5.0.0  (default — allows minor + patch updates)
// "~4.18.2"  → >=4.18.2, <4.19.0 (allows patch updates only)
// "4.18.2"   → Exactly 4.18.2
// ">=4.0.0"  → 4.0.0 or higher
// "*"        → Any version

// package-lock.json — locks exact versions for reproducible builds
// ALWAYS commit package-lock.json to version control!

// ---- 4. MANAGING PACKAGES ----

// List installed packages
// npm list                  # All deps (tree view)
// npm list --depth=0        # Top-level only
// npm list -g --depth=0     # Global packages

// Check for outdated packages
// npm outdated

// Update packages
// npm update               # Update within semver range
// npm install express@latest # Update to latest major version

// Remove packages
// npm uninstall express     # or: npm rm express
// npm uninstall -D nodemon  # Remove dev dependency

// Check for vulnerabilities
// npm audit
// npm audit fix             # Auto-fix vulnerabilities
// npm audit fix --force     # Fix even with breaking changes

// ---- 5. NPM SCRIPTS ----

// Scripts in package.json — run with: npm run <script-name>
const scriptsExample = {
  scripts: {
    // Special scripts (no "run" needed)
    start: "node src/index.js",          // npm start
    test: "jest --coverage",             // npm test

    // Custom scripts (need "npm run")
    dev: "nodemon src/index.js",         // npm run dev
    build: "tsc && npm run lint",        // Chain commands with &&
    lint: "eslint src/ --fix",
    "lint:check": "eslint src/",
    format: "prettier --write src/",
    clean: "rm -rf dist node_modules",
    seed: "node scripts/seed.js",

    // Pre/post hooks — run automatically
    pretest: "npm run lint",             // Runs before test
    posttest: "echo 'Tests complete!'",  // Runs after test

    // Environment-specific
    "start:prod": "NODE_ENV=production node src/index.js",
    "start:dev": "NODE_ENV=development nodemon src/index.js",
  },
};

// Run scripts:
// npm start          (special — no "run" needed)
// npm test           (special)
// npm run dev        (custom)
// npm run build

// ---- 6. POPULAR PACKAGES ----

const popularPackages = {
  // Web frameworks
  express: "Minimal web framework",
  fastify: "Fast web framework",

  // Database
  mongoose: "MongoDB ODM",
  prisma: "Modern ORM (PostgreSQL, MySQL, SQLite)",
  pg: "PostgreSQL client",

  // Utilities
  dotenv: "Load .env files",
  lodash: "Utility functions",
  dayjs: "Date manipulation",
  uuid: "Generate unique IDs",
  zod: "Schema validation",

  // Dev tools
  nodemon: "Auto-restart on file changes",
  jest: "Testing framework",
  eslint: "Code linting",
  prettier: "Code formatting",
  typescript: "Type checking",

  // Security
  helmet: "HTTP security headers",
  cors: "Cross-origin resource sharing",
  "express-rate-limit": "Rate limiting",
  bcrypt: "Password hashing",
  jsonwebtoken: "JWT tokens",
};

// ---- 7. .npmrc AND CONFIGURATION ----

// .npmrc — npm configuration file
// save-exact=true      # Save exact versions (no ^)
// engine-strict=true   # Enforce Node version
// init-author-name=Your Name

// .npmignore — files to exclude from published packages
// Similar to .gitignore

// ---- 8. CREATING AND PUBLISHING PACKAGES ----

// 1. Create package: npm init
// 2. Write code in src/index.js
// 3. Set "main" in package.json
// 4. Login: npm login
// 5. Publish: npm publish
// 6. Update version: npm version patch/minor/major
// 7. Publish update: npm publish

// npx — run packages without installing
// npx create-react-app my-app
// npx eslint src/
// npx ts-node script.ts

// ---- 9. PROJECT STRUCTURE BEST PRACTICES ----

const projectStructure = `
my-app/
├── src/
│   ├── index.js         # Entry point
│   ├── routes/           # Route handlers
│   ├── controllers/      # Business logic
│   ├── models/           # Data models
│   ├── middleware/        # Custom middleware
│   ├── utils/            # Utility functions
│   └── config/           # Configuration
├── tests/                # Test files
├── scripts/              # Build/seed scripts
├── .env                  # Environment variables (git ignored!)
├── .env.example          # Template for .env
├── .gitignore
├── .eslintrc.json
├── package.json
├── package-lock.json
└── README.md
`;

console.log("NPM guide complete!");
console.log("Key commands: npm init, npm install, npm run, npx");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Initialize a new project and install express, dotenv, and nodemon (as dev)
// 2. Create npm scripts for: start, dev, test, and lint
// 3. Check for outdated packages and update them safely
// 4. Create a simple CLI tool that can be run with npx
// 5. Set up .gitignore and .env files for a Node.js project
// 6. Explain the difference between dependencies and devDependencies
