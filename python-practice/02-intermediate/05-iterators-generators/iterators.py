"""
LESSON: Iterators
Iterator protocol, __iter__/__next__, custom iterators, infinite iterators, itertools.

Run: python3 iterators.py
"""
from itertools import chain, islice, cycle, count, product, combinations

# ===== ITERATOR PROTOCOL =====
print("--- Iterator Protocol ---")

# Every iterable has __iter__() returning an iterator
# Every iterator has __next__() returning next value or raising StopIteration

nums = [10, 20, 30]
iterator = iter(nums)       # calls nums.__iter__()

print(f"  next: {next(iterator)}")  # calls iterator.__next__()
print(f"  next: {next(iterator)}")
print(f"  next: {next(iterator)}")
# next(iterator) would raise StopIteration here

# ===== HOW FOR LOOPS WORK =====
print("\n--- For Loop Under the Hood ---")

# A for loop is syntactic sugar for:
colors = ["red", "green", "blue"]
it = iter(colors)
while True:
    try:
        color = next(it)
        print(f"  {color}")
    except StopIteration:
        break

# ===== CUSTOM ITERATOR: COUNTDOWN =====
print("\n--- Custom Iterator: Countdown ---")

class Countdown:
    """Iterator that counts down from n to 1."""

    def __init__(self, start: int):
        self.current = start

    def __iter__(self):
        return self  # iterator returns itself

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

for n in Countdown(5):
    print(f"  {n}", end=" ")
print()

# ===== CUSTOM ITERATOR: RANGE-LIKE =====
print("\n--- Custom Range ---")

class MyRange:
    """Simplified range implementation."""

    def __init__(self, start: int, stop: int, step: int = 1):
        self.start = start
        self.stop = stop
        self.step = step

    def __iter__(self):
        current = self.start
        while current < self.stop:
            yield current   # using yield makes __iter__ a generator
            current += self.step

    def __len__(self):
        return max(0, (self.stop - self.start + self.step - 1) // self.step)

for val in MyRange(0, 10, 3):
    print(f"  {val}", end=" ")
print()
print(f"  Length: {len(MyRange(0, 10, 3))}")

# ===== INFINITE ITERATOR =====
print("\n--- Infinite Iterator ---")

class InfiniteCounter:
    """Counts forever from start."""

    def __init__(self, start: int = 0):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        value = self.current
        self.current += 1
        return value

# Take first 5 values from infinite iterator
counter = InfiniteCounter(100)
first_five = [next(counter) for _ in range(5)]
print(f"  First five: {first_five}")

# ===== ITERABLE VS ITERATOR =====
print("\n--- Iterable vs Iterator ---")

# Iterable: has __iter__(), can be iterated multiple times
# Iterator: has __next__(), consumed after one pass

class ReusableSquares:
    """Iterable (not iterator) — can be looped multiple times."""

    def __init__(self, n: int):
        self.n = n

    def __iter__(self):
        # Returns a NEW iterator each time
        for i in range(self.n):
            yield i ** 2

squares = ReusableSquares(5)
print(f"  Pass 1: {list(squares)}")
print(f"  Pass 2: {list(squares)}")  # works again!

# ===== ITERTOOLS ESSENTIALS =====
print("\n--- itertools Highlights ---")

# chain: concatenate iterables
chained = list(chain([1, 2], [3, 4], [5]))
print(f"  chain: {chained}")

# islice: slice any iterable (even infinite)
sliced = list(islice(count(10), 5))  # count(10) = 10, 11, 12, ...
print(f"  islice(count(10), 5): {sliced}")

# cycle: repeat iterable forever
cycled = list(islice(cycle("AB"), 6))
print(f"  cycle('AB'): {cycled}")

# product: cartesian product
pairs = list(product("XY", [1, 2]))
print(f"  product: {pairs}")

# combinations
combos = list(combinations([1, 2, 3, 4], 2))
print(f"  C(4,2): {combos}")

# ===== BUILDING A PIPELINE WITH ITERATORS =====
print("\n--- Iterator Pipeline ---")

def read_data():
    """Simulate reading lines of data."""
    data = ["  Alice,85  ", "Bob,92", "  Charlie,78", "Diana,95", ""]
    for line in data:
        yield line

def strip_lines(lines):
    for line in lines:
        stripped = line.strip()
        if stripped:
            yield stripped

def parse_records(lines):
    for line in lines:
        name, score = line.split(",")
        yield {"name": name, "score": int(score)}

def high_scorers(records, threshold=90):
    for record in records:
        if record["score"] >= threshold:
            yield record

# Chain the pipeline — each step is lazy
pipeline = high_scorers(parse_records(strip_lines(read_data())))

for student in pipeline:
    print(f"  {student['name']}: {student['score']}")

# ===== SENTINEL ITERATOR =====
print("\n--- Sentinel with iter() ---")

# iter(callable, sentinel) — calls callable until sentinel is returned
import random
random.seed(42)

# Roll dice until we get a 6
rolls = list(iter(lambda: random.randint(1, 6), 6))
print(f"  Rolls before 6: {rolls}")
