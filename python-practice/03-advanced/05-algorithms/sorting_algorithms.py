"""
LESSON: Sorting Algorithms
Merge sort, quick sort, heap sort, counting sort, comparisons.

Run: python3 sorting_algorithms.py
"""
import time
import random

# ===== MERGE SORT =====
print("--- Merge Sort — O(n log n) ---")

def merge_sort(arr: list) -> list:
    """Stable, O(n log n) time, O(n) space."""
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left: list, right: list) -> list:
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

arr = [38, 27, 43, 3, 9, 82, 10]
print(f"  Input:  {arr}")
print(f"  Sorted: {merge_sort(arr)}")

# ===== QUICK SORT =====
print("\n--- Quick Sort — O(n log n) avg ---")

def quick_sort(arr: list) -> list:
    """Average O(n log n), worst O(n²), in-place possible."""
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)

arr = [64, 34, 25, 12, 22, 11, 90]
print(f"  Input:  {arr}")
print(f"  Sorted: {quick_sort(arr)}")

# In-place quicksort
def quick_sort_inplace(arr: list, low: int = 0, high: int | None = None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort_inplace(arr, low, pivot_idx - 1)
        quick_sort_inplace(arr, pivot_idx + 1, high)

def partition(arr: list, low: int, high: int) -> int:
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

arr2 = [10, 7, 8, 9, 1, 5]
quick_sort_inplace(arr2)
print(f"  In-place: {arr2}")

# ===== HEAP SORT =====
print("\n--- Heap Sort — O(n log n) ---")

def heap_sort(arr: list) -> list:
    """O(n log n), in-place, not stable."""
    import heapq
    heapq.heapify(arr)
    return [heapq.heappop(arr) for _ in range(len(arr))]

arr = [4, 10, 3, 5, 1, 8, 7]
print(f"  Input:  {arr}")
print(f"  Sorted: {heap_sort(arr.copy())}")

# ===== COUNTING SORT =====
print("\n--- Counting Sort — O(n + k) ---")

def counting_sort(arr: list[int]) -> list[int]:
    """O(n + k) where k = range of values. Only for non-negative integers."""
    if not arr:
        return []

    max_val = max(arr)
    count = [0] * (max_val + 1)

    for num in arr:
        count[num] += 1

    result = []
    for val, cnt in enumerate(count):
        result.extend([val] * cnt)

    return result

arr = [4, 2, 2, 8, 3, 3, 1, 7, 5, 5]
print(f"  Input:  {arr}")
print(f"  Sorted: {counting_sort(arr)}")

# ===== RADIX SORT =====
print("\n--- Radix Sort — O(d × n) ---")

def radix_sort(arr: list[int]) -> list[int]:
    """Sort non-negative integers digit by digit."""
    if not arr:
        return []

    max_val = max(arr)
    result = arr.copy()
    exp = 1

    while max_val // exp > 0:
        # Counting sort by current digit
        output = [0] * len(result)
        count = [0] * 10

        for num in result:
            digit = (num // exp) % 10
            count[digit] += 1

        for i in range(1, 10):
            count[i] += count[i - 1]

        for num in reversed(result):
            digit = (num // exp) % 10
            count[digit] -= 1
            output[count[digit]] = num

        result = output
        exp *= 10

    return result

arr = [170, 45, 75, 90, 802, 24, 2, 66]
print(f"  Input:  {arr}")
print(f"  Sorted: {radix_sort(arr)}")

# ===== INSERTION SORT =====
print("\n--- Insertion Sort — O(n²) ---")

def insertion_sort(arr: list) -> list:
    """Simple, stable, good for small/nearly-sorted arrays."""
    result = arr.copy()
    for i in range(1, len(result)):
        key = result[i]
        j = i - 1
        while j >= 0 and result[j] > key:
            result[j + 1] = result[j]
            j -= 1
        result[j + 1] = key
    return result

arr = [12, 11, 13, 5, 6]
print(f"  Input:  {arr}")
print(f"  Sorted: {insertion_sort(arr)}")

# ===== BINARY SEARCH =====
print("\n--- Binary Search — O(log n) ---")

def binary_search(arr: list, target) -> int:
    """Returns index of target, or -1 if not found."""
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

sorted_arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(f"  Array: {sorted_arr}")
print(f"  Search 23: index={binary_search(sorted_arr, 23)}")
print(f"  Search 50: index={binary_search(sorted_arr, 50)}")

# ===== PERFORMANCE COMPARISON =====
print("\n--- Performance Comparison ---")

def benchmark(sort_func, data, name):
    arr = data.copy()
    start = time.perf_counter()
    sort_func(arr)
    elapsed = time.perf_counter() - start
    return elapsed

N = 5000
random.seed(42)
data = [random.randint(0, 10000) for _ in range(N)]

algorithms = [
    ("Merge Sort", merge_sort),
    ("Quick Sort", quick_sort),
    ("Counting Sort", counting_sort),
    ("Python sorted()", sorted),
]

print(f"  Sorting {N} random integers:")
for name, func in algorithms:
    elapsed = benchmark(func, data, name)
    print(f"    {name:20s}: {elapsed:.4f}s")

# ===== COMPLEXITY SUMMARY =====
print("\n--- Sorting Complexity Summary ---")
print("""
  Algorithm       | Best     | Average  | Worst    | Space  | Stable
  ──────────────────────────────────────────────────────────────────
  Merge Sort      | O(nlogn) | O(nlogn) | O(nlogn) | O(n)   | Yes
  Quick Sort      | O(nlogn) | O(nlogn) | O(n²)    | O(logn)| No
  Heap Sort       | O(nlogn) | O(nlogn) | O(nlogn) | O(1)   | No
  Counting Sort   | O(n+k)   | O(n+k)   | O(n+k)   | O(k)   | Yes
  Radix Sort      | O(dn)    | O(dn)    | O(dn)    | O(n+k) | Yes
  Insertion Sort  | O(n)     | O(n²)    | O(n²)    | O(1)   | Yes
  Python Timsort  | O(n)     | O(nlogn) | O(nlogn) | O(n)   | Yes
""")
