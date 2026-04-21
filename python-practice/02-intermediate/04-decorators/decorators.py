"""
LESSON: Decorators
Function decorators, @wraps, parameterized decorators, class decorators, stacking.

Run: python3 decorators.py
"""
import time
from functools import wraps

# ===== BASIC DECORATOR =====
print("--- Basic Decorator ---")

def uppercase(func):
    """Decorator that uppercases string return values."""
    @wraps(func)  # preserves original function's name and docstring
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper() if isinstance(result, str) else result
    return wrapper

@uppercase
def greet(name: str) -> str:
    """Return a greeting."""
    return f"hello, {name}!"

print(greet("Emmanuel"))
print(f"Function name: {greet.__name__}")
print(f"Docstring: {greet.__doc__}")

# ===== TIMER DECORATOR =====
print("\n--- Timer Decorator ---")

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"  {func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_sum(n: int) -> int:
    return sum(range(n))

result = slow_sum(1_000_000)
print(f"  Result: {result}")

# ===== LOGGING DECORATOR =====
print("\n--- Logging Decorator ---")

def log_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        args_repr = [repr(a) for a in args]
        kwargs_repr = [f"{k}={v!r}" for k, v in kwargs.items()]
        signature = ", ".join(args_repr + kwargs_repr)
        print(f"  Calling {func.__name__}({signature})")
        result = func(*args, **kwargs)
        print(f"  {func.__name__} returned {result!r}")
        return result
    return wrapper

@log_calls
def add(a, b):
    return a + b

add(3, 4)
add(10, b=20)

# ===== PARAMETERIZED DECORATOR =====
print("\n--- Parameterized Decorator ---")

def repeat(times: int):
    """Decorator factory: returns a decorator that calls func N times."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(times):
                results.append(func(*args, **kwargs))
            return results
        return wrapper
    return decorator

@repeat(times=3)
def say_hello(name):
    print(f"  Hello, {name}!")
    return f"greeted {name}"

results = say_hello("World")
print(f"  Results: {results}")

# ===== RETRY DECORATOR =====
print("\n--- Retry Decorator ---")

def retry(max_attempts: int = 3, delay: float = 0.1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"  Attempt {attempt}/{max_attempts} failed: {e}")
                    if attempt == max_attempts:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator

attempt_counter = 0

@retry(max_attempts=3, delay=0.01)
def flaky_function():
    global attempt_counter
    attempt_counter += 1
    if attempt_counter < 3:
        raise ConnectionError("Network error")
    return "Success!"

result = flaky_function()
print(f"  Result: {result}")

# ===== STACKING DECORATORS =====
print("\n--- Stacking Decorators ---")

@timer
@log_calls
def multiply(a, b):
    return a * b

# Execution order: timer wraps (log_calls wraps multiply)
# So timer runs first (outer), then log_calls, then multiply
multiply(6, 7)

# ===== CLASS DECORATOR =====
print("\n--- Class Decorator ---")

def singleton(cls):
    """Class decorator: ensures only one instance exists."""
    instances = {}
    @wraps(cls)
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Database:
    def __init__(self, url: str = "localhost"):
        self.url = url
        print(f"  Database created: {url}")

db1 = Database("postgres://localhost")
db2 = Database("mysql://other")  # same instance returned!
print(f"  db1 is db2: {db1 is db2}")
print(f"  db1.url: {db1.url}")

# ===== DECORATOR WITH OPTIONAL ARGS =====
print("\n--- Decorator with Optional Args ---")

def debug(func=None, *, prefix="DEBUG"):
    """Can be used with or without parentheses."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            print(f"  [{prefix}] {func.__name__} called")
            return func(*args, **kwargs)
        return wrapper

    if func is not None:
        return decorator(func)
    return decorator

@debug  # without parentheses
def func_a():
    return "a"

@debug(prefix="INFO")  # with parentheses
def func_b():
    return "b"

func_a()
func_b()

# ===== PRACTICAL: CACHE / MEMOIZE =====
print("\n--- Memoize Decorator ---")

def memoize(func):
    cache = {}
    @wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    wrapper.cache = cache
    return wrapper

@memoize
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(f"  fibonacci(30) = {fibonacci(30)}")
print(f"  Cache size: {len(fibonacci.cache)}")
