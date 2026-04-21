"""
LESSON: Error Handling & Exceptions
try/except/else/finally, custom exceptions, exception chaining, EAFP vs LBYL.

Run: python3 exceptions.py
"""

# ===== BASIC TRY/EXCEPT =====
print("--- Basic try/except ---")

try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"  Caught: {e}")

# Multiple exception types
try:
    numbers = [1, 2, 3]
    print(numbers[10])
except (IndexError, KeyError) as e:
    print(f"  Caught {type(e).__name__}: {e}")

# ===== MULTIPLE EXCEPT BLOCKS =====
print("\n--- Multiple except Blocks ---")

def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        print("  Cannot divide by zero")
        return None
    except TypeError as e:
        print(f"  Type error: {e}")
        return None

print(f"  10/3 = {safe_divide(10, 3)}")
print(f"  10/0 = {safe_divide(10, 0)}")
print(f"  10/'a' = {safe_divide(10, 'a')}")

# ===== TRY/EXCEPT/ELSE/FINALLY =====
print("\n--- try/except/else/finally ---")

def read_number(text: str) -> int | None:
    try:
        value = int(text)
    except ValueError:
        print(f"  '{text}' is not a valid number")
        return None
    else:
        # Runs ONLY if no exception occurred
        print(f"  Successfully parsed: {value}")
        return value
    finally:
        # ALWAYS runs, even after return
        print(f"  Finished processing '{text}'")

read_number("42")
read_number("abc")

# ===== EXCEPTION HIERARCHY =====
print("\n--- Exception Hierarchy ---")

# BaseException
#   +-- SystemExit
#   +-- KeyboardInterrupt
#   +-- Exception
#       +-- ValueError
#       +-- TypeError
#       +-- KeyError
#       +-- IndexError
#       +-- FileNotFoundError (subclass of OSError)
#       +-- AttributeError
#       +-- RuntimeError
#       ...

# Catching parent catches children
try:
    int("not_a_number")
except Exception as e:
    print(f"  Caught {type(e).__name__}: {e}")

# ===== CUSTOM EXCEPTIONS =====
print("\n--- Custom Exceptions ---")

class AppError(Exception):
    """Base exception for our application."""
    pass

class ValidationError(AppError):
    """Raised when input validation fails."""
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

class NotFoundError(AppError):
    """Raised when a resource is not found."""
    def __init__(self, resource: str, id: int):
        self.resource = resource
        self.id = id
        super().__init__(f"{resource} with id={id} not found")

# Using custom exceptions
def create_user(name: str, age: int):
    if not name:
        raise ValidationError("name", "cannot be empty")
    if age < 0 or age > 150:
        raise ValidationError("age", f"invalid value: {age}")
    return {"name": name, "age": age}

try:
    create_user("", 25)
except ValidationError as e:
    print(f"  Validation failed — {e.field}: {e.message}")

try:
    create_user("Alice", -5)
except ValidationError as e:
    print(f"  Validation failed — {e.field}: {e.message}")

# ===== EXCEPTION CHAINING =====
print("\n--- Exception Chaining ---")

def fetch_config(key: str):
    config = {"host": "localhost", "port": "8080"}
    try:
        return int(config[key])
    except KeyError as e:
        raise NotFoundError("config", 0) from e
    except ValueError as e:
        raise ValidationError(key, "must be numeric") from e

try:
    fetch_config("missing_key")
except NotFoundError as e:
    print(f"  {e}")
    print(f"  Caused by: {e.__cause__}")

# ===== RERAISE AND SUPPRESS =====
print("\n--- Reraise ---")

def process_data(data):
    try:
        return data["key"]
    except KeyError:
        print("  Logging error, then re-raising...")
        raise  # re-raises the same exception

try:
    process_data({})
except KeyError:
    print("  Caught re-raised KeyError")

# ===== EAFP VS LBYL =====
print("\n--- EAFP vs LBYL ---")

data = {"name": "Alice", "scores": [90, 85, 95]}

# LBYL (Look Before You Leap) — common in C/Java
if "name" in data and isinstance(data.get("scores"), list) and len(data["scores"]) > 0:
    avg = sum(data["scores"]) / len(data["scores"])
    print(f"  LBYL average: {avg}")

# EAFP (Easier to Ask Forgiveness than Permission) — Pythonic
try:
    avg = sum(data["scores"]) / len(data["scores"])
    print(f"  EAFP average: {avg}")
except (KeyError, TypeError, ZeroDivisionError) as e:
    print(f"  Error: {e}")

# ===== CONTEXT MANAGER FOR ERROR HANDLING =====
print("\n--- Suppressing Exceptions ---")

from contextlib import suppress

# Instead of try/except pass:
with suppress(FileNotFoundError):
    with open("/nonexistent/file.txt") as f:
        content = f.read()
print("  Continued after suppressed FileNotFoundError")

# ===== PRACTICAL: RETRY WITH EXCEPTIONS =====
print("\n--- Retry Pattern ---")

import time

class MaxRetriesError(AppError):
    """All retry attempts exhausted."""
    pass

def retry(func, max_attempts=3, delay=0.01):
    """Retry a function up to max_attempts times."""
    errors = []
    for attempt in range(1, max_attempts + 1):
        try:
            return func()
        except Exception as e:
            errors.append(e)
            print(f"  Attempt {attempt}/{max_attempts}: {e}")
            if attempt < max_attempts:
                time.sleep(delay)
    raise MaxRetriesError(f"Failed after {max_attempts} attempts") from errors[-1]

counter = 0
def flaky():
    global counter
    counter += 1
    if counter < 3:
        raise ConnectionError("Server unavailable")
    return "Success!"

try:
    result = retry(flaky)
    print(f"  Result: {result}")
except MaxRetriesError as e:
    print(f"  {e}")

# ===== EXCEPTION GROUPS (Python 3.11+) =====
print("\n--- Exception Groups (3.11+) ---")

try:
    raise ExceptionGroup("multiple errors", [
        ValueError("bad value"),
        TypeError("wrong type"),
        KeyError("missing key"),
    ])
except* ValueError as eg:
    print(f"  Caught ValueError group: {eg.exceptions}")
except* TypeError as eg:
    print(f"  Caught TypeError group: {eg.exceptions}")
except* KeyError as eg:
    print(f"  Caught KeyError group: {eg.exceptions}")
