"""
LESSON: Comprehensions
List, dict, set comprehensions, generator expressions, nested comprehensions.

Run: python3 comprehensions.py
"""

# ===== LIST COMPREHENSION =====
print("--- List Comprehension ---")

# Basic: [expression for item in iterable]
squares = [x ** 2 for x in range(1, 11)]
print(f"Squares: {squares}")

# With condition: [expr for item in iterable if condition]
evens = [x for x in range(20) if x % 2 == 0]
print(f"Evens: {evens}")

# With transformation
names = ["alice", "bob", "charlie"]
upper = [name.upper() for name in names]
print(f"Upper: {upper}")

# With if-else (expression, not filter)
labels = ["even" if x % 2 == 0 else "odd" for x in range(6)]
print(f"Labels: {labels}")

# ===== REPLACING LOOPS =====
print("\n--- Comprehension vs Loop ---")

# Loop version
result_loop = []
for x in range(10):
    if x % 3 == 0:
        result_loop.append(x ** 2)

# Comprehension version (same result, more Pythonic)
result_comp = [x ** 2 for x in range(10) if x % 3 == 0]
print(f"Loop:          {result_loop}")
print(f"Comprehension: {result_comp}")

# ===== DICT COMPREHENSION =====
print("\n--- Dict Comprehension ---")

# Basic
squares_dict = {x: x ** 2 for x in range(1, 6)}
print(f"Squares dict: {squares_dict}")

# From two lists
keys = ["name", "age", "lang"]
vals = ["Emmanuel", 20, "Python"]
person = {k: v for k, v in zip(keys, vals)}
print(f"Person: {person}")

# Filter a dict
scores = {"Alice": 95, "Bob": 67, "Charlie": 82, "Diana": 91}
passed = {name: score for name, score in scores.items() if score >= 80}
print(f"Passed: {passed}")

# Swap keys and values
flipped = {v: k for k, v in scores.items()}
print(f"Flipped: {flipped}")

# ===== SET COMPREHENSION =====
print("\n--- Set Comprehension ---")

# Unique word lengths
words = ["hello", "world", "hi", "hey", "python", "code"]
lengths = {len(w) for w in words}
print(f"Unique lengths of {words}: {lengths}")

# Unique first letters
first_letters = {w[0].upper() for w in words}
print(f"First letters: {first_letters}")

# ===== GENERATOR EXPRESSION =====
print("\n--- Generator Expression ---")

# Like list comp but with () — lazy, memory efficient
gen = (x ** 2 for x in range(1, 6))
print(f"Generator: {gen}")
print(f"Values: {list(gen)}")

# Useful in functions that take iterables
total = sum(x ** 2 for x in range(1, 11))
print(f"Sum of squares 1-10: {total}")

any_even = any(x % 2 == 0 for x in [1, 3, 4, 7])
print(f"Any even in [1,3,4,7]: {any_even}")

all_positive = all(x > 0 for x in [3, 7, 2, 9])
print(f"All positive in [3,7,2,9]: {all_positive}")

max_len = max(len(w) for w in words)
print(f"Longest word length: {max_len}")

# ===== NESTED COMPREHENSION =====
print("\n--- Nested Comprehension ---")

# Flatten a 2D list
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [num for row in matrix for num in row]
print(f"Matrix: {matrix}")
print(f"Flattened: {flat}")

# Create a 2D list
grid = [[i * j for j in range(1, 5)] for i in range(1, 4)]
print(f"Grid:")
for row in grid:
    print(f"  {row}")

# Pairs
pairs = [(x, y) for x in range(3) for y in range(3) if x != y]
print(f"Pairs (x != y): {pairs}")

# ===== PRACTICAL EXAMPLES =====
print("\n--- Practical Examples ---")

# Filter and transform file extensions
files = ["report.pdf", "data.csv", "image.png", "notes.txt", "photo.jpg"]
text_files = [f for f in files if f.endswith(('.txt', '.csv'))]
print(f"Text files: {text_files}")

# Word frequency
sentence = "the cat sat on the mat the cat"
word_freq = {w: sentence.split().count(w) for w in set(sentence.split())}
print(f"Word freq: {word_freq}")

# Celsius to Fahrenheit
celsius = [0, 10, 20, 30, 40, 100]
to_fahr = {c: round(c * 9/5 + 32, 1) for c in celsius}
print(f"C -> F: {to_fahr}")

# FizzBuzz with comprehension
fizzbuzz = [
    "FizzBuzz" if i % 15 == 0
    else "Fizz" if i % 3 == 0
    else "Buzz" if i % 5 == 0
    else str(i)
    for i in range(1, 16)
]
print(f"FizzBuzz: {fizzbuzz}")
