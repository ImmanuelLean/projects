"""
LESSON: Comparison and Logical Operators
==, !=, <, >, and, or, not, is, in, chained comparisons.

Run: python3 comparison_logical.py
"""

# ===== COMPARISON OPERATORS =====
print("--- Comparison Operators ---")
a, b = 10, 20

print(f"{a} == {b}: {a == b}")
print(f"{a} != {b}: {a != b}")
print(f"{a} < {b}:  {a < b}")
print(f"{a} > {b}:  {a > b}")
print(f"{a} <= {b}: {a <= b}")
print(f"{a} >= {b}: {a >= b}")

# String comparison (lexicographic)
print(f"\n'apple' < 'banana': {'apple' < 'banana'}")
print(f"'abc' == 'abc': {'abc' == 'abc'}")
print(f"'A' < 'a': {'A' < 'a'}")  # uppercase < lowercase (ASCII)

# ===== CHAINED COMPARISONS =====
print("\n--- Chained Comparisons ---")
x = 15
print(f"x = {x}")
print(f"10 < x < 20: {10 < x < 20}")
print(f"10 < x < 12: {10 < x < 12}")
print(f"1 < 2 < 3 < 4: {1 < 2 < 3 < 4}")
print(f"0 <= x <= 100: {0 <= x <= 100}")

# ===== LOGICAL OPERATORS =====
print("\n--- Logical Operators ---")
t, f = True, False

print(f"True and True:  {t and t}")
print(f"True and False: {t and f}")
print(f"True or False:  {t or f}")
print(f"False or False: {f or f}")
print(f"not True:       {not t}")
print(f"not False:      {not f}")

# Short-circuit evaluation
print("\n--- Short-Circuit ---")
print(f"True or <not evaluated>: {True or print('never runs')}")
print(f"False and <not evaluated>: {False and print('never runs')}")

# and/or return actual values (not just True/False)
print(f"\n'hello' and 'world': {'hello' and 'world'}")  # 'world'
print(f"'' and 'world': {'' and 'world'!r}")             # ''
print(f"'hello' or 'world': {'hello' or 'world'}")      # 'hello'
print(f"'' or 'world': {'' or 'world'}")                 # 'world'
print(f"0 or 42: {0 or 42}")                             # 42
print(f"None or 'default': {None or 'default'}")         # 'default'

# Practical: default values
name = "" or "Anonymous"
port = 0 or 8080
print(f"\nname = '' or 'Anonymous' -> {name}")
print(f"port = 0 or 8080 -> {port}")

# ===== IDENTITY OPERATORS (is / is not) =====
print("\n--- Identity: is / is not ---")
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(f"a == b: {a == b}")       # True (same value)
print(f"a is b: {a is b}")       # False (different objects)
print(f"a is c: {a is c}")       # True (same object)

# Always use 'is' for None
x = None
print(f"\nx is None: {x is None}")
print(f"x is not None: {x is not None}")

# ===== MEMBERSHIP OPERATORS (in / not in) =====
print("\n--- Membership: in / not in ---")
fruits = ["apple", "banana", "mango"]
print(f"'banana' in fruits: {'banana' in fruits}")
print(f"'grape' in fruits: {'grape' in fruits}")
print(f"'grape' not in fruits: {'grape' not in fruits}")

# Works with strings
print(f"'py' in 'python': {'py' in 'python'}")

# Works with dicts (checks keys)
scores = {"alice": 95, "bob": 87}
print(f"'alice' in scores: {'alice' in scores}")
print(f"95 in scores: {95 in scores}")  # False! checks keys

# Works with sets
evens = {2, 4, 6, 8}
print(f"4 in evens: {4 in evens}")

# ===== OPERATOR PRECEDENCE =====
print("\n--- Operator Precedence ---")
print("Order (high to low):")
print("  ** (exponent)")
print("  +x, -x, ~x (unary)")
print("  *, /, //, %")
print("  +, -")
print("  <, >, <=, >=, ==, !=")
print("  not")
print("  and")
print("  or")

result = 2 + 3 * 4 ** 2
print(f"\n2 + 3 * 4 ** 2 = {result}")
print(f"  = 2 + 3 * 16 = 2 + 48 = 50")
