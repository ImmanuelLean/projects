"""
LESSON: Functional Programming Patterns
map, filter, reduce, partial, compose, closures, immutability.

Run: python3 functional_patterns.py
"""
from functools import reduce, partial, lru_cache
from operator import add, mul, itemgetter, attrgetter
from itertools import accumulate, starmap

# ===== MAP =====
print("--- map() ---")

numbers = [1, 2, 3, 4, 5]

# map applies a function to every element
squared = list(map(lambda x: x**2, numbers))
print(f"  Squared: {squared}")

# map with named function
def celsius_to_fahrenheit(c):
    return c * 9/5 + 32

temps_c = [0, 20, 37, 100]
temps_f = list(map(celsius_to_fahrenheit, temps_c))
print(f"  Celsius:    {temps_c}")
print(f"  Fahrenheit: {temps_f}")

# map with multiple iterables
names = ["alice", "bob", "charlie"]
ages = [30, 25, 35]
records = list(map(lambda n, a: f"{n.title()} ({a})", names, ages))
print(f"  Records: {records}")

# ===== FILTER =====
print("\n--- filter() ---")

numbers = range(1, 21)

# Filter even numbers
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(f"  Evens: {evens}")

# Filter with None removes falsy values
mixed = [0, 1, "", "hello", None, [], [1, 2], False, True]
truthy = list(filter(None, mixed))
print(f"  Truthy values: {truthy}")

# ===== REDUCE =====
print("\n--- reduce() ---")

numbers = [1, 2, 3, 4, 5]

# Sum using reduce
total = reduce(add, numbers)
print(f"  Sum: {total}")

# Product using reduce
product = reduce(mul, numbers)
print(f"  Product: {product}")

# Reduce with initial value
total_with_init = reduce(add, numbers, 100)
print(f"  Sum with init=100: {total_with_init}")

# Build a string
words = ["Python", "is", "awesome"]
sentence = reduce(lambda a, b: f"{a} {b}", words)
print(f"  Sentence: {sentence}")

# Find max using reduce
largest = reduce(lambda a, b: a if a > b else b, [3, 7, 2, 9, 1])
print(f"  Largest: {largest}")

# ===== PARTIAL APPLICATION =====
print("\n--- functools.partial ---")

# Create specialized functions from general ones
def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(f"  square(5): {square(5)}")
print(f"  cube(3): {cube(3)}")

# Partial with built-in
int_from_binary = partial(int, base=2)
print(f"  Binary '1010': {int_from_binary('1010')}")

# Partial for logging
def log(level, message):
    print(f"  [{level}] {message}")

info = partial(log, "INFO")
error = partial(log, "ERROR")

info("Server started")
error("Connection failed")

# ===== CLOSURES =====
print("\n--- Closures ---")

def make_multiplier(factor):
    """Returns a closure that multiplies by factor."""
    def multiplier(x):
        return x * factor
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)

print(f"  double(5): {double(5)}")
print(f"  triple(5): {triple(5)}")
print(f"  Closure vars: {double.__closure__[0].cell_contents}")

# Counter closure
def make_counter(start=0):
    count = [start]  # list to allow mutation in closure
    def counter():
        count[0] += 1
        return count[0]
    return counter

counter = make_counter()
print(f"  Count: {counter()}, {counter()}, {counter()}")

# ===== FUNCTION COMPOSITION =====
print("\n--- Function Composition ---")

def compose(*functions):
    """Compose functions right-to-left: compose(f, g)(x) = f(g(x))."""
    def composed(x):
        result = x
        for fn in reversed(functions):
            result = fn(result)
        return result
    return composed

def add_one(x): return x + 1
def double(x): return x * 2
def negate(x): return -x

# negate(double(add_one(5))) = negate(double(6)) = negate(12) = -12
transform = compose(negate, double, add_one)
print(f"  compose(negate, double, add_one)(5) = {transform(5)}")

# Pipe (left-to-right composition)
def pipe(*functions):
    """Compose functions left-to-right: pipe(f, g)(x) = g(f(x))."""
    def piped(x):
        result = x
        for fn in functions:
            result = fn(result)
        return result
    return piped

process = pipe(str.strip, str.lower, str.title)
print(f"  pipe('  HELLO WORLD  '): '{process('  HELLO WORLD  ')}'")

# ===== OPERATOR MODULE =====
print("\n--- operator Module ---")

students = [
    {"name": "Alice", "grade": 92},
    {"name": "Bob", "grade": 85},
    {"name": "Charlie", "grade": 98},
]

# itemgetter instead of lambda
by_grade = sorted(students, key=itemgetter("grade"), reverse=True)
print(f"  Top student: {by_grade[0]['name']}")

# Multiple keys
data = [(3, "c"), (1, "a"), (2, "b")]
sorted_data = sorted(data, key=itemgetter(0))
print(f"  Sorted by first: {sorted_data}")

# ===== ACCUMULATE =====
print("\n--- itertools.accumulate ---")

numbers = [1, 2, 3, 4, 5]
running_sum = list(accumulate(numbers))
running_product = list(accumulate(numbers, mul))

print(f"  Running sum:     {running_sum}")
print(f"  Running product: {running_product}")
print(f"  Running max:     {list(accumulate([3, 1, 4, 1, 5, 9], max))}")

# ===== STARMAP =====
print("\n--- itertools.starmap ---")

# starmap unpacks arguments from tuples
pairs = [(2, 3), (4, 5), (6, 7)]
products = list(starmap(mul, pairs))
print(f"  Products: {products}")

# ===== HIGHER-ORDER PATTERNS =====
print("\n--- Higher-Order Patterns ---")

# Map-reduce pattern
words = ["hello world", "foo bar baz", "python is great"]

word_count = reduce(
    add,
    map(lambda s: len(s.split()), words)
)
print(f"  Total words: {word_count}")

# Filter-map-reduce
data = [10, -5, 20, -3, 15, -8, 25]

positive_sum = reduce(
    add,
    map(lambda x: x * 2,           # double each
        filter(lambda x: x > 0, data))  # keep positives
)
print(f"  Sum of doubled positives: {positive_sum}")

# ===== MEMOIZATION =====
print("\n--- Memoization with lru_cache ---")

@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(f"  fib(50): {fibonacci(50)}")
print(f"  Cache info: {fibonacci.cache_info()}")

# ===== IMMUTABLE DATA PATTERNS =====
print("\n--- Immutable Patterns ---")

from typing import NamedTuple

class Point(NamedTuple):
    x: float
    y: float

    def translate(self, dx, dy):
        """Returns a NEW point (immutable pattern)."""
        return Point(self.x + dx, self.y + dy)

    def scale(self, factor):
        return Point(self.x * factor, self.y * factor)

p1 = Point(3, 4)
p2 = p1.translate(1, 2)
p3 = p2.scale(2)

print(f"  p1: {p1}")
print(f"  p2 (translated): {p2}")
print(f"  p3 (scaled): {p3}")
print(f"  p1 unchanged: {p1}")
