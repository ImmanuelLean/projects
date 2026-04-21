"""
LESSON: Generators
yield, generator expressions, send/throw, yield from, memory efficiency.

Run: python3 generators.py
"""
import sys

# ===== BASIC GENERATOR =====
print("--- Basic Generator ---")

def count_up_to(n: int):
    """Generator that yields 1 to n."""
    i = 1
    while i <= n:
        yield i     # pauses here, returns value
        i += 1      # resumes here on next()

gen = count_up_to(5)
print(f"  Type: {type(gen)}")
print(f"  First: {next(gen)}")
print(f"  Second: {next(gen)}")
print(f"  Rest: {list(gen)}")  # consumes remaining

# ===== GENERATOR EXPRESSIONS =====
print("\n--- Generator Expressions ---")

# List comprehension: builds entire list in memory
squares_list = [x**2 for x in range(10)]

# Generator expression: lazy, one value at a time
squares_gen = (x**2 for x in range(10))

print(f"  List: {squares_list}")
print(f"  Gen type: {type(squares_gen)}")
print(f"  Gen values: {list(squares_gen)}")

# ===== MEMORY EFFICIENCY =====
print("\n--- Memory Comparison ---")

# List stores all values
big_list = [x for x in range(100_000)]
list_size = sys.getsizeof(big_list)

# Generator stores only the recipe
big_gen = (x for x in range(100_000))
gen_size = sys.getsizeof(big_gen)

print(f"  List size: {list_size:,} bytes")
print(f"  Generator size: {gen_size:,} bytes")
print(f"  Ratio: {list_size / gen_size:.0f}x")

# ===== FIBONACCI GENERATOR =====
print("\n--- Fibonacci Generator ---")

def fibonacci():
    """Infinite Fibonacci sequence."""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Take first 10 fibonacci numbers
from itertools import islice
fib_10 = list(islice(fibonacci(), 10))
print(f"  First 10: {fib_10}")

# ===== GENERATOR WITH RETURN VALUE =====
print("\n--- Generator with Return ---")

def accumulate(values):
    """Yields running totals, returns final sum."""
    total = 0
    for v in values:
        total += v
        yield total
    return total  # accessible via StopIteration.value

gen = accumulate([10, 20, 30, 40])
for val in gen:
    print(f"  Running: {val}")

# To capture return value:
gen2 = accumulate([1, 2, 3])
while True:
    try:
        next(gen2)
    except StopIteration as e:
        print(f"  Final return value: {e.value}")
        break

# ===== SEND: TWO-WAY COMMUNICATION =====
print("\n--- send() to Generator ---")

def echo_generator():
    """Generator that receives values via send()."""
    print("  Generator started")
    while True:
        received = yield  # yield returns what was sent
        if received is None:
            break
        print(f"  Received: {received}")

gen = echo_generator()
next(gen)           # prime the generator (advance to first yield)
gen.send("Hello")
gen.send("World")
try:
    gen.send(None)  # signal to stop
except StopIteration:
    print("  Generator finished")

# ===== RUNNING AVERAGE WITH SEND =====
print("\n--- Running Average with send() ---")

def running_average():
    """Generator that computes running average of sent values."""
    total = 0.0
    count = 0
    average = None
    while True:
        value = yield average
        if value is None:
            break
        total += value
        count += 1
        average = total / count

avg = running_average()
next(avg)  # prime
print(f"  After 10: {avg.send(10)}")
print(f"  After 20: {avg.send(20)}")
print(f"  After 30: {avg.send(30)}")
print(f"  After 15: {avg.send(15)}")

# ===== THROW: INJECT EXCEPTIONS =====
print("\n--- throw() into Generator ---")

def careful_generator():
    try:
        while True:
            value = yield
            print(f"  Got: {value}")
    except ValueError as e:
        print(f"  Caught thrown error: {e}")
        yield "recovered"

gen = careful_generator()
next(gen)
gen.send(42)
result = gen.throw(ValueError, "bad input!")
print(f"  Recovery result: {result}")

# ===== YIELD FROM: DELEGATION =====
print("\n--- yield from ---")

def inner():
    yield 1
    yield 2
    return "inner done"

def outer():
    # yield from delegates to inner generator
    result = yield from inner()
    print(f"  Inner returned: {result}")
    yield 3

print(f"  Values: {list(outer())}")

# ===== YIELD FROM: FLATTEN =====
print("\n--- yield from: Flatten Nested Lists ---")

def flatten(nested):
    """Recursively flatten nested iterables."""
    for item in nested:
        if isinstance(item, (list, tuple)):
            yield from flatten(item)
        else:
            yield item

nested = [1, [2, 3, [4, 5]], 6, [7, [8, [9]]]]
flat = list(flatten(nested))
print(f"  Nested: {nested}")
print(f"  Flat:   {flat}")

# ===== GENERATOR-BASED PIPELINE =====
print("\n--- Data Processing Pipeline ---")

def read_lines():
    """Simulate reading a log file."""
    logs = [
        "INFO: User logged in",
        "ERROR: Database connection failed",
        "INFO: Page loaded",
        "WARNING: Slow query detected",
        "ERROR: Timeout on API call",
        "INFO: User logged out",
    ]
    yield from logs

def filter_level(lines, level):
    for line in lines:
        if line.startswith(level):
            yield line

def extract_message(lines):
    for line in lines:
        _, message = line.split(": ", 1)
        yield message

# Build pipeline
errors = extract_message(filter_level(read_lines(), "ERROR"))
for msg in errors:
    print(f"  ERROR: {msg}")

# ===== GENERATOR AS COROUTINE PATTERN =====
print("\n--- Generator as State Machine ---")

def traffic_light():
    """Simple state machine using generator."""
    while True:
        yield "🔴 RED"
        yield "🟡 YELLOW"
        yield "🟢 GREEN"
        yield "🟡 YELLOW"

light = traffic_light()
for _ in range(8):
    print(f"  {next(light)}")
