"""
LESSON: Function Basics
def, return, *args, **kwargs, default params, type hints, recursion.

Run: python3 function_basics.py
"""

# ===== BASIC FUNCTIONS =====
print("--- Basic Functions ---")

def greet(name: str) -> str:
    """Return a greeting for the given name."""
    return f"Hello, {name}!"

print(greet("Emmanuel"))

def add(a: int, b: int) -> int:
    return a + b

print(f"add(3, 4) = {add(3, 4)}")

# ===== MULTIPLE RETURN VALUES =====
print("\n--- Multiple Returns ---")

def min_max(numbers: list[int]) -> tuple[int, int]:
    return min(numbers), max(numbers)

lo, hi = min_max([5, 2, 8, 1, 9])
print(f"min={lo}, max={hi}")

def divide(a: int, b: int) -> tuple[int, int]:
    return a // b, a % b

quotient, remainder = divide(17, 5)
print(f"17 / 5 = {quotient} remainder {remainder}")

# ===== DEFAULT PARAMETERS =====
print("\n--- Default Parameters ---")

def power(base: int, exp: int = 2) -> int:
    return base ** exp

print(f"power(5) = {power(5)}")       # 25
print(f"power(2, 10) = {power(2, 10)}")  # 1024

def create_user(name: str, role: str = "user", active: bool = True) -> dict:
    return {"name": name, "role": role, "active": active}

print(create_user("Alice"))
print(create_user("Bob", role="admin"))

# GOTCHA: mutable default arguments
def bad_append(item, lst=[]):  # DON'T do this!
    lst.append(item)
    return lst

def good_append(item, lst=None):  # DO this instead
    if lst is None:
        lst = []
    lst.append(item)
    return lst

print(f"\ngood_append(1): {good_append(1)}")
print(f"good_append(2): {good_append(2)}")

# ===== *ARGS AND **KWARGS =====
print("\n--- *args and **kwargs ---")

def sum_all(*args: int) -> int:
    """Accept any number of positional arguments."""
    print(f"  args = {args}, type = {type(args).__name__}")
    return sum(args)

print(f"sum_all(1,2,3) = {sum_all(1, 2, 3)}")
print(f"sum_all(1,2,3,4,5) = {sum_all(1, 2, 3, 4, 5)}")

def build_profile(**kwargs: str) -> dict:
    """Accept any number of keyword arguments."""
    print(f"  kwargs = {kwargs}")
    return kwargs

profile = build_profile(name="Emmanuel", age=20, lang="Python")
print(f"profile = {profile}")

def combined(required, *args, **kwargs):
    print(f"  required={required}, args={args}, kwargs={kwargs}")

combined("hello", 1, 2, 3, key="value", flag=True)

# Unpacking into function calls
def show(a, b, c):
    print(f"  a={a}, b={b}, c={c}")

nums = [1, 2, 3]
show(*nums)     # unpack list

info = {"a": 10, "b": 20, "c": 30}
show(**info)    # unpack dict

# ===== KEYWORD-ONLY AND POSITIONAL-ONLY =====
print("\n--- Keyword-only / Positional-only ---")

# After * — keyword only
def kw_only(a, b, *, mode="fast"):
    print(f"  a={a}, b={b}, mode={mode}")

kw_only(1, 2)
kw_only(1, 2, mode="slow")
# kw_only(1, 2, "slow")  # ERROR

# Before / — positional only (Python 3.8+)
def pos_only(a, b, /, c=10):
    print(f"  a={a}, b={b}, c={c}")

pos_only(1, 2)
pos_only(1, 2, c=30)
# pos_only(a=1, b=2)  # ERROR

# ===== DOCSTRINGS =====
print("\n--- Docstrings ---")

def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """Calculate Body Mass Index.

    Args:
        weight_kg: Weight in kilograms.
        height_m: Height in meters.

    Returns:
        BMI value as a float.
    """
    return weight_kg / (height_m ** 2)

print(f"BMI: {calculate_bmi(70, 1.75):.1f}")
print(f"Docstring: {calculate_bmi.__doc__[:40]}...")

# ===== RECURSION =====
print("\n--- Recursion ---")

def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(f"factorial(10) = {factorial(10)}")
print(f"fibonacci(10) = {fibonacci(10)}")

# ===== FUNCTIONS AS OBJECTS =====
print("\n--- Functions as Objects ---")

def square(x): return x ** 2
def cube(x): return x ** 3

operations = {"square": square, "cube": cube}
for name, func in operations.items():
    print(f"  {name}(5) = {func(5)}")

def apply(func, value):
    return func(value)

print(f"apply(square, 7) = {apply(square, 7)}")
