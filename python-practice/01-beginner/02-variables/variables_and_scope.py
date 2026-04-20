"""
LESSON: Variables and Scope
Variable assignment, naming conventions, global/local scope, LEGB rule.

Run: python3 variables_and_scope.py
"""

# ===== VARIABLE ASSIGNMENT =====
print("--- Variable Assignment ---")
x = 10
y = 20.5
name = "Emmanuel"

# Multiple assignment
a, b, c = 1, 2, 3
print(f"a={a}, b={b}, c={c}")

# Swap without temp variable
a, b = b, a
print(f"After swap: a={a}, b={b}")

# Same value
x = y = z = 0
print(f"x=y=z={x}")

# Augmented assignment
count = 10
count += 5   # count = count + 5
count *= 2   # count = count * 2
count //= 3  # count = count // 3
print(f"count after +=5, *=2, //=3: {count}")

# Unpacking
coords = (10, 20, 30)
x, y, z = coords
print(f"Unpacked: x={x}, y={y}, z={z}")

# Star unpacking
first, *rest = [1, 2, 3, 4, 5]
print(f"first={first}, rest={rest}")

*start, last = [1, 2, 3, 4, 5]
print(f"start={start}, last={last}")

# ===== NAMING CONVENTIONS (PEP 8) =====
print("\n--- Naming Conventions ---")

# snake_case for variables and functions
user_name = "alice"
total_count = 42

# UPPER_CASE for constants
MAX_RETRIES = 3
PI = 3.14159

# PascalCase for classes
# class MyClass:

# _single_leading_underscore = "internal use" convention
# __double_leading = "name mangling" in classes
# __dunder__ = "special/magic methods"

print(f"snake_case: user_name = {user_name}")
print(f"UPPER_CASE constant: MAX_RETRIES = {MAX_RETRIES}")
print("PascalCase: for class names (e.g., MyClass)")
print("_private: convention for internal use")

# ===== VARIABLE IDENTITY =====
print("\n--- Identity & Interning ---")
a = 256
b = 256
print(f"a = {a}, b = {b}")
print(f"a == b: {a == b}")  # value equality
print(f"a is b: {a is b}")  # identity (same object) — True for small ints

a = [1, 2, 3]
b = [1, 2, 3]
print(f"\na = {a}, b = {b}")
print(f"a == b: {a == b}")  # True (same value)
print(f"a is b: {a is b}")  # False (different objects)
print(f"id(a): {id(a)}, id(b): {id(b)}")

# ===== SCOPE: LEGB RULE =====
print("\n--- LEGB Scope Rule ---")
print("L = Local, E = Enclosing, G = Global, B = Built-in")

# Global scope
global_var = "I'm global"

def outer():
    enclosing_var = "I'm enclosing"

    def inner():
        local_var = "I'm local"
        print(f"  Local: {local_var}")
        print(f"  Enclosing: {enclosing_var}")
        print(f"  Global: {global_var}")
        print(f"  Built-in: {len.__name__}")  # built-in function

    inner()

outer()

# ===== GLOBAL KEYWORD =====
print("\n--- global keyword ---")
counter = 0

def increment():
    global counter
    counter += 1

increment()
increment()
increment()
print(f"counter after 3 increments: {counter}")

# ===== NONLOCAL KEYWORD =====
print("\n--- nonlocal keyword ---")

def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

counter = make_counter()
print(f"counter(): {counter()}")
print(f"counter(): {counter()}")
print(f"counter(): {counter()}")

# ===== DELETE VARIABLES =====
print("\n--- Deleting Variables ---")
temp = "temporary"
print(f"temp exists: {temp}")
del temp
try:
    print(temp)
except NameError as e:
    print(f"After del: {e}")
