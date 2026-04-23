// ============================================
// MODULES & DECLARATION FILES
// ============================================

// ===== ES MODULES =====

// Named exports
export const API_URL = "https://api.example.com";
export function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then(r => r.json());
}

export interface User {
  id: number;
  name: string;
}

// Default export
export default class ApiClient {
  constructor(private baseUrl: string) {}

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`);
    return res.json();
  }
}

// Import examples (in another file):
// import ApiClient from './api';                    // default
// import { API_URL, fetchData, User } from './api'; // named
// import ApiClient, { API_URL } from './api';       // both
// import * as Api from './api';                     // namespace
// import type { User } from './api';               // type-only import

// ===== TYPE-ONLY IMPORTS/EXPORTS =====

// Only import the TYPE, not the value (erased at compile time)
// import type { User } from './models';
// import { type User, fetchData } from './api';

// Export type only
export type CreateUserInput = Omit<User, "id">;

// ===== DECLARATION FILES (.d.ts) =====

// Declaration files describe types for JS libraries
// They contain NO implementation, only type signatures

/*
// custom.d.ts
declare module 'untyped-library' {
  export function doSomething(value: string): number;
  export interface Config {
    timeout: number;
    retries: number;
  }
}
*/

// ===== AMBIENT DECLARATIONS =====

// Declare global variables (e.g., from a <script> tag)
/*
// globals.d.ts
declare const __VERSION__: string;
declare const __DEV__: boolean;

// Extend existing globals
declare global {
  interface Window {
    analytics: {
      track(event: string, data?: Record<string, unknown>): void;
    };
  }
}
*/

// ===== MODULE AUGMENTATION =====

// Extend third-party types
/*
// express.d.ts
import 'express';

declare module 'express' {
  interface Request {
    userId?: number;
    role?: string;
  }
}

// Now req.userId is typed everywhere
app.use((req, res, next) => {
  req.userId = 123;  // ✅ typed
  next();
});
*/

// ===== NAMESPACE (Rare, prefer modules) =====
namespace Validation {
  export interface Rule {
    validate(value: string): boolean;
    message: string;
  }

  export class RequiredRule implements Rule {
    message = "Field is required";
    validate(value: string): boolean {
      return value.trim().length > 0;
    }
  }

  export class MinLengthRule implements Rule {
    constructor(private min: number) {
      this.message = `Minimum ${min} characters`;
    }
    message: string;
    validate(value: string): boolean {
      return value.length >= this.min;
    }
  }
}

const rules: Validation.Rule[] = [
  new Validation.RequiredRule(),
  new Validation.MinLengthRule(8),
];

// ===== TRIPLE-SLASH DIRECTIVES =====
// Reference other declaration files (rare, use imports instead)
// /// <reference path="./globals.d.ts" />
// /// <reference types="node" />

// ===== @types PACKAGES =====

// Install type definitions for JS libraries:
// npm install -D @types/express @types/node @types/lodash
//
// DefinitelyTyped: https://github.com/DefinitelyTyped/DefinitelyTyped
// Search types: https://www.typescriptlang.org/dt/search
//
// tsconfig.json:
// "typeRoots": ["./node_modules/@types", "./src/types"]
// "types": ["node", "jest"]

// ===== tsconfig.json ESSENTIALS =====

const tsconfigReference = `
{
  "compilerOptions": {
    // ===== Strictness (always enable!) =====
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    // ===== Modules =====
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,

    // ===== Output =====
    "target": "ES2022",
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true,

    // ===== Paths =====
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    },

    // ===== Checks =====
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
`;

console.log("\n=== Modules & Declarations ===");
console.log(`API_URL: ${API_URL}`);
rules.forEach(r => console.log(`  Rule: ${r.message}, test="": ${r.validate("")}`));

// export {}; // already has exports above
