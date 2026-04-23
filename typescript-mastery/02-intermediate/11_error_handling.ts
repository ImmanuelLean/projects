// ============================================
// TYPE-SAFE ERROR HANDLING
// ============================================

// ===== CUSTOM ERROR CLASSES =====

class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype); // fix instanceof
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string | number) {
    super(`${resource} with id '${id}' not found`, "NOT_FOUND", 404);
  }
}

class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly field: string,
    public readonly details: string[] = []
  ) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
  }
}

// ===== TYPE-SAFE TRY/CATCH =====

// Problem: catch(e) — e is 'unknown' in strict mode
function riskyOperation(): string {
  try {
    throw new Error("Something broke");
  } catch (error: unknown) {
    // Must narrow the type
    if (error instanceof AppError) {
      console.log(`App error: ${error.code} — ${error.message}`);
      return error.message;
    }
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
      return error.message;
    }
    console.log(`Unknown error: ${String(error)}`);
    return "Unknown error";
  }
}

// ===== RESULT TYPE (No exceptions) =====

type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Helper functions
function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Usage
interface User {
  id: number;
  name: string;
  email: string;
}

function parseEmail(input: string): Result<string, ValidationError> {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed.includes("@")) {
    return Err(new ValidationError("Invalid email format", "email"));
  }
  return Ok(trimmed);
}

function findUser(id: number): Result<User, NotFoundError> {
  const users: User[] = [
    { id: 1, name: "Alice", email: "alice@test.com" },
  ];
  const user = users.find(u => u.id === id);
  if (!user) return Err(new NotFoundError("User", id));
  return Ok(user);
}

// Handling Result
const emailResult = parseEmail("alice@test.com");
if (emailResult.ok) {
  console.log(`Valid email: ${emailResult.value}`); // string
} else {
  console.log(`Error: ${emailResult.error.message}`); // ValidationError
}

const userResult = findUser(1);
if (userResult.ok) {
  console.log(`Found: ${userResult.value.name}`);
} else {
  console.log(`Not found: ${userResult.error.message}`);
}

// ===== CHAINING RESULTS =====

function createAccount(
  email: string,
  name: string
): Result<User, ValidationError | AppError> {
  const emailResult = parseEmail(email);
  if (!emailResult.ok) return emailResult;

  if (name.length < 2) {
    return Err(new ValidationError("Name too short", "name"));
  }

  const user: User = {
    id: Date.now(),
    name,
    email: emailResult.value,
  };
  return Ok(user);
}

const accountResult = createAccount("bob@test.com", "Bob");
if (accountResult.ok) {
  console.log(`Account created: ${accountResult.value.name}`);
}

// ===== ASYNC RESULT =====

type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

async function fetchUser(id: number): AsyncResult<User, AppError> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      if (response.status === 404) return Err(new NotFoundError("User", id));
      return Err(new AppError(`HTTP ${response.status}`, "HTTP_ERROR", response.status));
    }
    const user = await response.json();
    return Ok(user);
  } catch (error) {
    return Err(new AppError("Network error", "NETWORK_ERROR"));
  }
}

// ===== EXHAUSTIVE ERROR HANDLING =====

type AppErrors =
  | { type: "NOT_FOUND"; resource: string }
  | { type: "VALIDATION"; field: string; message: string }
  | { type: "UNAUTHORIZED" }
  | { type: "NETWORK"; retryable: boolean };

function handleError(error: AppErrors): string {
  switch (error.type) {
    case "NOT_FOUND":
      return `${error.resource} not found`;
    case "VALIDATION":
      return `${error.field}: ${error.message}`;
    case "UNAUTHORIZED":
      return "Please log in";
    case "NETWORK":
      return error.retryable ? "Retrying..." : "Network error";
    default:
      const _exhaustive: never = error;
      return _exhaustive; // compile error if case is missing
  }
}

// ===== UTILITY: tryCatch WRAPPER =====

async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<Result<T, Error>> {
  try {
    const value = await fn();
    return Ok(value);
  } catch (error) {
    return Err(error instanceof Error ? error : new Error(String(error)));
  }
}

// Usage
async function example() {
  const result = await tryCatch(() => fetch("/api/data").then(r => r.json()));
  if (result.ok) {
    console.log(result.value);
  } else {
    console.error(result.error.message);
  }
}

console.log("\n=== Error Handling ===");
riskyOperation();
console.log(`parseEmail result: ${JSON.stringify(parseEmail("valid@email.com"))}`);
console.log(`parseEmail error: ${JSON.stringify(parseEmail("invalid"))}`);

export {};
