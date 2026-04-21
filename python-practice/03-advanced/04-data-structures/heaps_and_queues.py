"""
LESSON: Heaps & Priority Queues
heapq module, custom priority queue, heap operations, applications.

Run: python3 heaps_and_queues.py
"""
import heapq
from dataclasses import dataclass, field
from typing import Any

# ===== HEAPQ BASICS =====
print("--- heapq Basics (Min-Heap) ---")

# heapq implements a min-heap on a regular list
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
heapq.heappush(heap, 3)
heapq.heappush(heap, 7)
heapq.heappush(heap, 2)

print(f"  Heap: {heap}")
print(f"  Min element (peek): {heap[0]}")

# Pop elements in order
ordered = []
while heap:
    ordered.append(heapq.heappop(heap))
print(f"  Popped in order: {ordered}")

# ===== HEAPIFY =====
print("\n--- heapify ---")

data = [9, 5, 7, 1, 3, 8, 2, 6, 4]
heapq.heapify(data)  # in-place O(n)
print(f"  Heapified: {data}")

# ===== NLARGEST / NSMALLEST =====
print("\n--- nlargest / nsmallest ---")

scores = [85, 92, 78, 95, 88, 76, 91, 83, 97, 70]
print(f"  Top 3: {heapq.nlargest(3, scores)}")
print(f"  Bottom 3: {heapq.nsmallest(3, scores)}")

# With key function
students = [
    {"name": "Alice", "gpa": 3.8},
    {"name": "Bob", "gpa": 3.5},
    {"name": "Charlie", "gpa": 3.9},
    {"name": "Diana", "gpa": 3.2},
]

top = heapq.nlargest(2, students, key=lambda s: s["gpa"])
print(f"  Top 2 students: {[s['name'] for s in top]}")

# ===== MAX-HEAP (using negation) =====
print("\n--- Max-Heap ---")

max_heap = []
for val in [5, 1, 3, 7, 2]:
    heapq.heappush(max_heap, -val)  # negate to simulate max-heap

print(f"  Max element: {-max_heap[0]}")

max_ordered = []
while max_heap:
    max_ordered.append(-heapq.heappop(max_heap))
print(f"  Max order: {max_ordered}")

# ===== MERGE SORTED ITERABLES =====
print("\n--- Merge Sorted Lists ---")

list1 = [1, 4, 7, 10]
list2 = [2, 5, 8, 11]
list3 = [3, 6, 9, 12]

merged = list(heapq.merge(list1, list2, list3))
print(f"  Merged: {merged}")

# ===== CUSTOM PRIORITY QUEUE =====
print("\n--- Priority Queue ---")

@dataclass(order=True)
class PriorityItem:
    priority: int
    item: Any = field(compare=False)

class PriorityQueue:
    def __init__(self):
        self._heap: list[PriorityItem] = []
        self._counter = 0

    def push(self, item: Any, priority: int):
        entry = PriorityItem(priority, item)
        heapq.heappush(self._heap, entry)

    def pop(self) -> Any:
        return heapq.heappop(self._heap).item

    def peek(self) -> Any:
        return self._heap[0].item

    def __len__(self):
        return len(self._heap)

    def __bool__(self):
        return bool(self._heap)

pq = PriorityQueue()
pq.push("Low priority task", 3)
pq.push("URGENT task", 1)
pq.push("Medium task", 2)
pq.push("Critical task", 0)

while pq:
    print(f"  Processing: {pq.pop()}")

# ===== APPLICATION: TASK SCHEDULER =====
print("\n--- Task Scheduler ---")

class TaskScheduler:
    """Process tasks by priority and arrival order."""

    def __init__(self):
        self._queue = []
        self._counter = 0  # tiebreaker for same priority

    def add_task(self, name: str, priority: int):
        self._counter += 1
        heapq.heappush(self._queue, (priority, self._counter, name))
        print(f"  Added: {name} (priority={priority})")

    def process_next(self) -> str | None:
        if self._queue:
            priority, _, name = heapq.heappop(self._queue)
            return name
        return None

    def process_all(self):
        while self._queue:
            task = self.process_next()
            print(f"  → Processing: {task}")

scheduler = TaskScheduler()
scheduler.add_task("Send email", 2)
scheduler.add_task("Fix critical bug", 0)
scheduler.add_task("Update docs", 3)
scheduler.add_task("Deploy hotfix", 0)
scheduler.add_task("Code review", 1)

print("  Processing order:")
scheduler.process_all()

# ===== APPLICATION: MEDIAN FINDER =====
print("\n--- Median Finder (Two Heaps) ---")

class MedianFinder:
    """Find median from a data stream using two heaps."""

    def __init__(self):
        self.low = []   # max-heap (negated) for lower half
        self.high = []  # min-heap for upper half

    def add(self, num: int):
        heapq.heappush(self.low, -num)

        # Ensure max of low <= min of high
        if self.low and self.high and (-self.low[0] > self.high[0]):
            val = -heapq.heappop(self.low)
            heapq.heappush(self.high, val)

        # Balance sizes
        if len(self.low) > len(self.high) + 1:
            val = -heapq.heappop(self.low)
            heapq.heappush(self.high, val)
        elif len(self.high) > len(self.low):
            val = heapq.heappop(self.high)
            heapq.heappush(self.low, -val)

    def median(self) -> float:
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2

mf = MedianFinder()
for num in [5, 15, 1, 3, 8, 7, 9]:
    mf.add(num)
    print(f"  Added {num:2d} → median = {mf.median()}")

# ===== APPLICATION: K CLOSEST POINTS =====
print("\n--- K Closest Points ---")

def k_closest(points: list[tuple[int, int]], k: int) -> list[tuple[int, int]]:
    """Find k points closest to origin using a heap."""
    heap = []
    for x, y in points:
        dist = x*x + y*y
        heapq.heappush(heap, (dist, (x, y)))

    return [heapq.heappop(heap)[1] for _ in range(k)]

points = [(3, 3), (5, -1), (-2, 4), (1, 1), (0, 2)]
closest = k_closest(points, 3)
print(f"  Points: {points}")
print(f"  3 closest to origin: {closest}")
