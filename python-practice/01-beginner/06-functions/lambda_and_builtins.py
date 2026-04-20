"""
LESSON: Lambda Functions and Built-in Functions
lambda, map, filter, sorted with key, reduce, partial, any, all.

Run: python3 lambda_and_builtins.py
"""
from functools import reduce, partial

# ===== LAMBDA FUNCTIONS =====
print("--- Lambda Functions ---")

# Lambda: anonymous one-line function
square = lambda x: x ** 2
add = lambda a, b: a + b
greet = lambda name: f"Hello, {name}!"

print(f"square(5) = {square(5)}")
print(f"add(3, 4) = {add(3, 4)}")
print(f"greet('Emmanuel') = {greet('Emmanuel')}")

# Lambda with conditional
classify = lambda x: "positive" if x > 0 else "negative" if x < 0 else "zero"
for n in [-5, 0, 7]:
    print(f"  classify({n}) = {classify(n)}")

# ===== MAP =====
print("\n--- map() ---")
nums = [1, 2, 3, 4, 5]

# Apply function to each element
squared = list(map(lambda x: x ** 2, nums))
print(f"Squared: {squared}")

# With named function
def celsius_to_fahrenheit(c):
    return round(c * 9/5 + 32, 1)

temps_c = [0, 20, 37, 100]
temps_f = list(map(celsius_to_fahrenheit, temps_c))
print(f"Celsius:    {temps_c}")
print(f"Fahrenheit: {temps_f}")

# Map with multiple iterables
a = [1, 2, 3]
b = [10, 20, 30]
sums = list(map(lambda x, y: x + y, a, b))
print(f"Pairwise sums: {sums}")

# Map vs comprehension (comprehension preferred in Python)
comp = [x ** 2 for x in nums]
print(f"Comprehension (preferred): {comp}")

# ===== FILTER =====
print("\n--- filter() ---")
nums = list(range(1, 21))

evens = list(filter(lambda x: x % 2 == 0, nums))
print(f"Evens: {evens}")

# Filter strings
words = ["hello", "", "world", "", "python", ""]
non_empty = list(filter(None, words))  # None removes falsy values
print(f"Non-empty: {non_empty}")

# Filter with named function
def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0: return False
    return True

primes = list(filter(is_prime, range(2, 30)))
print(f"Primes < 30: {primes}")

# ===== SORTED WITH KEY =====
print("\n--- sorted() with key ---")

# Sort by absolute value
nums = [-5, 3, -2, 8, -1, 4]
by_abs = sorted(nums, key=abs)
print(f"By absolute: {by_abs}")

# Sort strings by length
words = ["banana", "apple", "cherry", "fig", "date"]
by_len = sorted(words, key=len)
print(f"By length: {by_len}")

# Sort dicts by value
students = [
    {"name": "Alice", "gpa": 3.9},
    {"name": "Bob", "gpa": 3.5},
    {"name": "Charlie", "gpa": 3.7},
]
by_gpa = sorted(students, key=lambda s: s["gpa"], reverse=True)
for s in by_gpa:
    print(f"  {s['name']}: {s['gpa']}")

# Sort with multiple criteria
data = [("Alice", 90), ("Bob", 95), ("Charlie", 90), ("Diana", 95)]
by_score_name = sorted(data, key=lambda x: (-x[1], x[0]))
print(f"\nBy score desc, name asc: {by_score_name}")

# ===== REDUCE =====
print("\n--- reduce() ---")

# Sum (use sum() instead, this is for demo)
total = reduce(lambda a, b: a + b, [1, 2, 3, 4, 5])
print(f"Sum: {total}")

# Product
product = reduce(lambda a, b: a * b, [1, 2, 3, 4, 5])
print(f"Product: {product}")

# Find max (use max() instead)
maximum = reduce(lambda a, b: a if a > b else b, [3, 7, 2, 9, 1])
print(f"Max: {maximum}")

# Flatten
nested = [[1, 2], [3, 4], [5, 6]]
flat = reduce(lambda a, b: a + b, nested)
print(f"Flatten: {flat}")

# ===== PARTIAL =====
print("\n--- partial() ---")

def power(base, exp):
    return base ** exp

square = partial(power, exp=2)
cube = partial(power, exp=3)

print(f"square(5) = {square(5)}")
print(f"cube(3) = {cube(3)}")

# Practical: logging with prefix
def log(level, message):
    print(f"  [{level}] {message}")

info = partial(log, "INFO")
error = partial(log, "ERROR")

info("Server started")
error("Connection failed")

# ===== ANY / ALL =====
print("\n--- any() and all() ---")
nums = [2, 4, 6, 8, 10]
print(f"all even: {all(x % 2 == 0 for x in nums)}")
print(f"any > 8:  {any(x > 8 for x in nums)}")
print(f"any > 20: {any(x > 20 for x in nums)}")

# ===== MIN / MAX WITH KEY =====
print("\n--- min/max with key ---")
words = ["banana", "apple", "cherry", "fig"]
print(f"Shortest: {min(words, key=len)}")
print(f"Longest:  {max(words, key=len)}")
print(f"First alphabetically: {min(words)}")

# ===== ZIP + MAP + FILTER PIPELINE =====
print("\n--- Pipeline Example ---")
names = ["Alice", "Bob", "Charlie", "Diana", "Eve"]
scores = [85, 42, 91, 67, 78]

# Find students who passed (>= 70), sorted by score
passed = sorted(
    filter(lambda pair: pair[1] >= 70, zip(names, scores)),
    key=lambda pair: pair[1],
    reverse=True
)
print("Passed students:")
for name, score in passed:
    print(f"  {name}: {score}")
