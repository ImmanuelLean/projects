"""
LESSON: Lists and Tuples
List methods, slicing, unpacking, tuples, named tuples.

Run: python3 lists_tuples.py
"""
from collections import namedtuple

# ===== LIST CREATION =====
print("--- List Creation ---")
empty = []
nums = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True, None]
nested = [[1, 2], [3, 4], [5, 6]]
from_range = list(range(1, 11))

print(f"nums: {nums}")
print(f"mixed types: {mixed}")
print(f"nested: {nested}")
print(f"from range: {from_range}")

# ===== INDEXING & SLICING =====
print("\n--- Indexing & Slicing ---")
letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

print(f"letters = {letters}")
print(f"letters[0] = {letters[0]}")      # first
print(f"letters[-1] = {letters[-1]}")    # last
print(f"letters[1:4] = {letters[1:4]}")  # slice
print(f"letters[:3] = {letters[:3]}")    # first 3
print(f"letters[4:] = {letters[4:]}")    # from index 4
print(f"letters[::2] = {letters[::2]}")  # every 2nd
print(f"letters[::-1] = {letters[::-1]}")  # reversed

# Slice assignment
nums = [1, 2, 3, 4, 5]
nums[1:3] = [20, 30]
print(f"\nAfter nums[1:3] = [20,30]: {nums}")

# ===== LIST METHODS =====
print("\n--- List Methods ---")
fruits = ["apple", "banana", "cherry"]

fruits.append("date")
print(f"append('date'): {fruits}")

fruits.insert(1, "avocado")
print(f"insert(1,'avocado'): {fruits}")

fruits.extend(["fig", "grape"])
print(f"extend(['fig','grape']): {fruits}")

removed = fruits.pop()
print(f"pop(): removed {removed!r}, list: {fruits}")

removed = fruits.pop(1)
print(f"pop(1): removed {removed!r}, list: {fruits}")

fruits.remove("cherry")
print(f"remove('cherry'): {fruits}")

# Sorting
nums = [5, 2, 8, 1, 9, 3]
nums.sort()
print(f"\nsort(): {nums}")

nums.sort(reverse=True)
print(f"sort(reverse=True): {nums}")

words = ["banana", "apple", "Cherry", "date"]
words.sort(key=str.lower)
print(f"sort(key=str.lower): {words}")

# sorted() returns new list
original = [3, 1, 4, 1, 5, 9]
sorted_copy = sorted(original)
print(f"\noriginal: {original}")
print(f"sorted():  {sorted_copy}")

# Other methods
nums = [1, 2, 3, 2, 1, 2]
print(f"\nnums = {nums}")
print(f"count(2): {nums.count(2)}")
print(f"index(3): {nums.index(3)}")

nums.reverse()
print(f"reverse(): {nums}")

# ===== UNPACKING =====
print("\n--- Unpacking ---")
a, b, c = [10, 20, 30]
print(f"a={a}, b={b}, c={c}")

first, *rest = [1, 2, 3, 4, 5]
print(f"first={first}, rest={rest}")

first, *middle, last = [1, 2, 3, 4, 5]
print(f"first={first}, middle={middle}, last={last}")

# ===== LIST AS STACK / QUEUE =====
print("\n--- Stack (LIFO) ---")
stack = []
stack.append("a")
stack.append("b")
stack.append("c")
print(f"Stack: {stack}")
print(f"Pop: {stack.pop()}")
print(f"Stack: {stack}")

from collections import deque
print("\n--- Queue (FIFO) ---")
queue = deque(["a", "b", "c"])
queue.append("d")
print(f"Queue: {list(queue)}")
print(f"Dequeue: {queue.popleft()}")
print(f"Queue: {list(queue)}")

# ===== COPYING LISTS =====
print("\n--- Copying ---")
original = [1, [2, 3], 4]
shallow = original.copy()       # or original[:]
shallow[0] = 99
shallow[1][0] = 99

print(f"original: {original}")   # [1, [99, 3], 4] — nested list changed!
print(f"shallow:  {shallow}")

import copy
original = [1, [2, 3], 4]
deep = copy.deepcopy(original)
deep[1][0] = 99
print(f"\noriginal: {original}")  # unchanged
print(f"deep:     {deep}")

# ===== TUPLES =====
print("\n--- Tuples (Immutable) ---")
point = (3, 4)
single = (42,)         # need trailing comma!
empty_tuple = ()
from_list = tuple([1, 2, 3])

print(f"point: {point}, type: {type(point).__name__}")
print(f"single: {single}")
print(f"point[0]: {point[0]}")
print(f"Immutable: can't do point[0] = 10")

# Tuple unpacking
x, y = point
print(f"Unpacked: x={x}, y={y}")

# Tuple methods
t = (1, 2, 3, 2, 1, 2)
print(f"\ncount(2): {t.count(2)}")
print(f"index(3): {t.index(3)}")

# Tuples as dict keys (lists can't be)
locations = {(40.7, -74.0): "New York", (51.5, -0.1): "London"}
print(f"locations[(40.7, -74.0)]: {locations[(40.7, -74.0)]}")

# ===== NAMED TUPLES =====
print("\n--- Named Tuples ---")
Point = namedtuple('Point', ['x', 'y', 'z'])
Color = namedtuple('Color', 'red green blue')

p = Point(1, 2, 3)
print(f"Point: {p}")
print(f"p.x={p.x}, p.y={p.y}, p.z={p.z}")
print(f"p[0]={p[0]}")  # also indexable

c = Color(255, 128, 0)
print(f"Color: {c}")
print(f"As dict: {c._asdict()}")
print(f"Replace: {c._replace(blue=255)}")
