"""
LESSON: Dynamic Programming
Memoization, tabulation, classic DP problems, optimization techniques.

Run: python3 dynamic_programming.py
"""
from functools import lru_cache

# ===== FIBONACCI: RECURSION VS DP =====
print("--- Fibonacci: Recursion vs DP ---")

# 1. Naive recursion — O(2^n)
def fib_naive(n: int) -> int:
    if n < 2:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)

# 2. Memoization (top-down) — O(n)
@lru_cache(maxsize=None)
def fib_memo(n: int) -> int:
    if n < 2:
        return n
    return fib_memo(n - 1) + fib_memo(n - 2)

# 3. Tabulation (bottom-up) — O(n), O(n) space
def fib_tab(n: int) -> int:
    if n < 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

# 4. Space-optimized — O(n), O(1) space
def fib_opt(n: int) -> int:
    if n < 2:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

n = 30
print(f"  fib({n}) = {fib_opt(n)}")
print(f"  Memo check: {fib_memo(n)}")
print(f"  Tab check:  {fib_tab(n)}")

# ===== CLIMBING STAIRS =====
print("\n--- Climbing Stairs ---")

def climb_stairs(n: int) -> int:
    """How many ways to climb n stairs (1 or 2 steps at a time)?"""
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

for n in [3, 5, 10]:
    print(f"  stairs({n}): {climb_stairs(n)} ways")

# ===== COIN CHANGE =====
print("\n--- Coin Change ---")

def coin_change(coins: list[int], amount: int) -> int:
    """Minimum coins needed to make amount. Returns -1 if impossible."""
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1

    return dp[amount] if dp[amount] != float('inf') else -1

coins = [1, 5, 10, 25]
for amount in [11, 30, 63]:
    result = coin_change(coins, amount)
    print(f"  coins={coins}, amount={amount}: {result} coins")

# ===== LONGEST COMMON SUBSEQUENCE =====
print("\n--- Longest Common Subsequence ---")

def lcs(s1: str, s2: str) -> tuple[int, str]:
    """Find length and actual LCS of two strings."""
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # Backtrack to find the actual subsequence
    result = []
    i, j = m, n
    while i > 0 and j > 0:
        if s1[i - 1] == s2[j - 1]:
            result.append(s1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1

    subsequence = "".join(reversed(result))
    return dp[m][n], subsequence

s1, s2 = "ABCBDAB", "BDCAB"
length, subseq = lcs(s1, s2)
print(f"  LCS('{s1}', '{s2}')")
print(f"  Length: {length}, Subsequence: '{subseq}'")

# ===== 0/1 KNAPSACK =====
print("\n--- 0/1 Knapsack ---")

def knapsack(weights: list[int], values: list[int], capacity: int) -> tuple[int, list[int]]:
    """Returns max value and indices of selected items."""
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i - 1][w]  # don't take item i
            if weights[i - 1] <= w:
                take = dp[i - 1][w - weights[i - 1]] + values[i - 1]
                dp[i][w] = max(dp[i][w], take)

    # Backtrack to find selected items
    selected = []
    w = capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            selected.append(i - 1)
            w -= weights[i - 1]

    return dp[n][capacity], list(reversed(selected))

weights = [2, 3, 4, 5]
values = [3, 4, 5, 6]
capacity = 8

max_val, items = knapsack(weights, values, capacity)
print(f"  Items: weights={weights}, values={values}")
print(f"  Capacity: {capacity}")
print(f"  Max value: {max_val}")
print(f"  Selected indices: {items}")
print(f"  Selected weights: {[weights[i] for i in items]}")

# ===== LONGEST INCREASING SUBSEQUENCE =====
print("\n--- Longest Increasing Subsequence ---")

def lis(arr: list[int]) -> tuple[int, list[int]]:
    """Find length and actual LIS."""
    n = len(arr)
    dp = [1] * n
    prev = [-1] * n

    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                prev[i] = j

    # Find the end of LIS
    max_len = max(dp)
    end_idx = dp.index(max_len)

    # Reconstruct
    result = []
    idx = end_idx
    while idx != -1:
        result.append(arr[idx])
        idx = prev[idx]

    return max_len, list(reversed(result))

arr = [10, 9, 2, 5, 3, 7, 101, 18]
length, subseq = lis(arr)
print(f"  Array: {arr}")
print(f"  LIS length: {length}")
print(f"  LIS: {subseq}")

# ===== EDIT DISTANCE =====
print("\n--- Edit Distance (Levenshtein) ---")

def edit_distance(s1: str, s2: str) -> int:
    """Minimum operations (insert, delete, replace) to transform s1 → s2."""
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # delete
                    dp[i][j - 1],      # insert
                    dp[i - 1][j - 1],  # replace
                )

    return dp[m][n]

pairs = [
    ("kitten", "sitting"),
    ("sunday", "saturday"),
    ("python", "pyhton"),
]

for s1, s2 in pairs:
    dist = edit_distance(s1, s2)
    print(f"  '{s1}' → '{s2}': {dist} operations")

# ===== MAXIMUM SUBARRAY (Kadane's) =====
print("\n--- Maximum Subarray (Kadane's Algorithm) ---")

def max_subarray(arr: list[int]) -> tuple[int, int, int]:
    """Returns (max_sum, start_index, end_index)."""
    max_sum = current_sum = arr[0]
    start = end = temp_start = 0

    for i in range(1, len(arr)):
        if current_sum + arr[i] < arr[i]:
            current_sum = arr[i]
            temp_start = i
        else:
            current_sum += arr[i]

        if current_sum > max_sum:
            max_sum = current_sum
            start = temp_start
            end = i

    return max_sum, start, end

arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
max_sum, start, end = max_subarray(arr)
print(f"  Array: {arr}")
print(f"  Max sum: {max_sum}")
print(f"  Subarray: {arr[start:end+1]} (indices {start}..{end})")

# ===== DP APPROACH GUIDE =====
print("\n--- DP Problem-Solving Guide ---")
print("""
  1. Identify overlapping subproblems
  2. Define the state (what dp[i] or dp[i][j] represents)
  3. Write the recurrence relation
  4. Determine base cases
  5. Choose approach:
     - Memoization (top-down): natural recursion + cache
     - Tabulation (bottom-up): iterative, often more efficient
  6. Optimize space if possible (rolling array)
""")
