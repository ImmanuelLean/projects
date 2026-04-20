"""
LESSON: Loops
for, while, range(), enumerate(), zip(), break, continue, else on loops.

Run: python3 loops.py
"""

# ===== FOR LOOPS =====
print("--- For Loop Basics ---")
fruits = ["apple", "banana", "cherry", "date"]

for fruit in fruits:
    print(f"  {fruit}")

# ===== RANGE() =====
print("\n--- range() ---")
print("range(5):", list(range(5)))           # 0,1,2,3,4
print("range(2,8):", list(range(2, 8)))      # 2,3,4,5,6,7
print("range(0,10,2):", list(range(0, 10, 2)))  # 0,2,4,6,8
print("range(10,0,-2):", list(range(10, 0, -2)))  # 10,8,6,4,2

# ===== ENUMERATE =====
print("\n--- enumerate() ---")
colors = ["red", "green", "blue", "yellow"]

for i, color in enumerate(colors):
    print(f"  [{i}] {color}")

for i, color in enumerate(colors, start=1):
    print(f"  #{i}: {color}")

# ===== ZIP =====
print("\n--- zip() ---")
names = ["Alice", "Bob", "Charlie"]
scores = [95, 87, 92]
grades = ["A", "B+", "A-"]

for name, score, grade in zip(names, scores, grades):
    print(f"  {name}: {score} ({grade})")

# zip stops at shortest — use zip_longest for all
from itertools import zip_longest
short = [1, 2]
long = [10, 20, 30, 40]
print(f"\nzip: {list(zip(short, long))}")
print(f"zip_longest: {list(zip_longest(short, long, fillvalue=0))}")

# ===== WHILE LOOPS =====
print("\n--- While Loop ---")
count = 5
while count > 0:
    print(f"  Countdown: {count}")
    count -= 1
print("  Liftoff! 🚀")

# ===== BREAK =====
print("\n--- break ---")
for n in range(1, 100):
    if n * n > 50:
        print(f"  First n where n² > 50: {n} (n²={n*n})")
        break

# ===== CONTINUE =====
print("\n--- continue ---")
print("  Odd numbers 1-10:", end=" ")
for n in range(1, 11):
    if n % 2 == 0:
        continue
    print(n, end=" ")
print()

# ===== ELSE ON LOOPS =====
print("\n--- for/else ---")

def find_prime_factor(n):
    for i in range(2, n):
        if n % i == 0:
            print(f"  {n} is divisible by {i}")
            break
    else:
        # Only runs if loop completed WITHOUT break
        print(f"  {n} is prime!")

for num in [7, 12, 17, 25]:
    find_prime_factor(num)

# while/else
print("\n--- while/else ---")
n = 10
while n > 1:
    if n == 5:
        print(f"  Found 5, breaking!")
        break
    n -= 1
else:
    print("  Loop completed without break")

# ===== NESTED LOOPS =====
print("\n--- Nested Loops ---")
for i in range(1, 4):
    for j in range(1, 4):
        print(f"  ({i},{j})", end="")
    print()

# Multiplication table
print("\n--- Multiplication Table (1-5) ---")
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i*j:4}", end="")
    print()

# ===== LOOPING PATTERNS =====
print("\n--- Common Patterns ---")

# Pattern 1: Accumulate
total = 0
for n in range(1, 11):
    total += n
print(f"Sum 1-10: {total}")

# Pattern 2: Build a list
squares = []
for n in range(1, 6):
    squares.append(n ** 2)
print(f"Squares: {squares}")

# Pattern 3: Find max
data = [34, 67, 23, 89, 12, 56]
maximum = data[0]
for val in data[1:]:
    if val > maximum:
        maximum = val
print(f"Max of {data}: {maximum}")

# Pattern 4: Loop with index using enumerate
words = ["hello", "world", "python"]
for idx, word in enumerate(words):
    words[idx] = word.upper()
print(f"Uppercased: {words}")

# Pattern 5: Iterate dict
person = {"name": "Emmanuel", "age": 20, "lang": "Python"}
for key, value in person.items():
    print(f"  {key}: {value}")
