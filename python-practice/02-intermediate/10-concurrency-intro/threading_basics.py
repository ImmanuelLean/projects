"""
LESSON: Threading Basics
threading module, GIL, locks, thread pool, concurrent.futures.

Run: python3 threading_basics.py
"""
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# ===== BASIC THREAD =====
print("--- Basic Thread ---")

def worker(name: str, duration: float):
    """Simple worker function."""
    print(f"  [{name}] Starting (thread: {threading.current_thread().name})")
    time.sleep(duration)
    print(f"  [{name}] Finished after {duration}s")

# Create and start threads
t1 = threading.Thread(target=worker, args=("Task-A", 0.3))
t2 = threading.Thread(target=worker, args=("Task-B", 0.2))

t1.start()
t2.start()

# Wait for both to finish
t1.join()
t2.join()
print("  Both threads completed")

# ===== THREAD WITH RETURN VALUE =====
print("\n--- Thread with Return Value ---")

results = {}

def compute_square(n: int, result_dict: dict):
    """Store result in shared dictionary."""
    time.sleep(0.1)
    result_dict[n] = n ** 2

threads = []
for num in [2, 4, 6, 8]:
    t = threading.Thread(target=compute_square, args=(num, results))
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print(f"  Squares: {results}")

# ===== THE GIL =====
print("\n--- The GIL (Global Interpreter Lock) ---")

print("""  The GIL ensures only one thread runs Python bytecode at a time.
  This means:
  - CPU-bound tasks: threads DON'T speed things up (use multiprocessing)
  - I/O-bound tasks: threads DO help (GIL is released during I/O)
  - Network calls, file I/O, sleep() all release the GIL""")

# ===== I/O-BOUND EXAMPLE =====
print("\n--- I/O-Bound Speedup ---")

def simulate_api_call(url: str) -> str:
    """Simulate a slow API call."""
    time.sleep(0.2)  # simulates network latency
    return f"Response from {url}"

urls = [f"https://api.example.com/data/{i}" for i in range(5)]

# Sequential
start = time.perf_counter()
sequential_results = [simulate_api_call(url) for url in urls]
seq_time = time.perf_counter() - start

# Threaded
start = time.perf_counter()
threaded_results = []
threads = []
for url in urls:
    t = threading.Thread(target=lambda u: threaded_results.append(simulate_api_call(u)), args=(url,))
    threads.append(t)
    t.start()
for t in threads:
    t.join()
thread_time = time.perf_counter() - start

print(f"  Sequential: {seq_time:.2f}s")
print(f"  Threaded:   {thread_time:.2f}s")
print(f"  Speedup:    {seq_time/thread_time:.1f}x")

# ===== THREAD SAFETY: RACE CONDITION =====
print("\n--- Race Condition ---")

# Unsafe: shared mutable state without lock
unsafe_counter = 0

def increment_unsafe(n: int):
    global unsafe_counter
    for _ in range(n):
        unsafe_counter += 1  # NOT atomic!

unsafe_counter = 0
threads = [threading.Thread(target=increment_unsafe, args=(100_000,)) for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"  Expected: 400,000")
print(f"  Got:      {unsafe_counter:,} (may differ due to race condition)")

# ===== THREAD SAFETY: LOCK =====
print("\n--- Lock (Mutex) ---")

safe_counter = 0
lock = threading.Lock()

def increment_safe(n: int):
    global safe_counter
    for _ in range(n):
        with lock:  # acquire and release automatically
            safe_counter += 1

safe_counter = 0
threads = [threading.Thread(target=increment_safe, args=(100_000,)) for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"  Expected: 400,000")
print(f"  Got:      {safe_counter:,} ✅")

# ===== RLOCK (REENTRANT LOCK) =====
print("\n--- RLock (Reentrant Lock) ---")

rlock = threading.RLock()

def recursive_function(n: int):
    """RLock allows the same thread to acquire multiple times."""
    with rlock:
        if n > 0:
            recursive_function(n - 1)
        else:
            print(f"  Reached bottom (thread: {threading.current_thread().name})")

recursive_function(3)

# ===== EVENT =====
print("\n--- Threading Event ---")

event = threading.Event()

def waiter(name: str):
    print(f"  [{name}] Waiting for event...")
    event.wait()
    print(f"  [{name}] Event received!")

t1 = threading.Thread(target=waiter, args=("Worker-1",))
t2 = threading.Thread(target=waiter, args=("Worker-2",))
t1.start()
t2.start()

time.sleep(0.2)
print("  [Main] Setting event!")
event.set()

t1.join()
t2.join()

# ===== DAEMON THREADS =====
print("\n--- Daemon Threads ---")

def background_task():
    """Daemon thread: dies when main thread exits."""
    while True:
        time.sleep(0.1)

daemon = threading.Thread(target=background_task, daemon=True)
daemon.start()
print(f"  Daemon alive: {daemon.is_alive()}")
print(f"  Is daemon: {daemon.daemon}")
# daemon thread will be killed when program exits

# ===== CONCURRENT.FUTURES: ThreadPoolExecutor =====
print("\n--- ThreadPoolExecutor ---")

def fetch_data(item_id: int) -> dict:
    """Simulate fetching data."""
    time.sleep(0.1)
    return {"id": item_id, "data": f"result_{item_id}"}

# Using context manager for automatic cleanup
with ThreadPoolExecutor(max_workers=4) as executor:
    # Submit individual tasks
    futures = {executor.submit(fetch_data, i): i for i in range(6)}

    # Process results as they complete
    for future in as_completed(futures):
        item_id = futures[future]
        try:
            result = future.result()
            print(f"  Item {item_id}: {result['data']}")
        except Exception as e:
            print(f"  Item {item_id} failed: {e}")

# ===== EXECUTOR.MAP =====
print("\n--- executor.map() ---")

def process_item(x: int) -> int:
    time.sleep(0.05)
    return x ** 2

with ThreadPoolExecutor(max_workers=4) as executor:
    # map preserves order (unlike as_completed)
    results = list(executor.map(process_item, range(8)))
    print(f"  Squared: {results}")

# ===== THREAD-LOCAL DATA =====
print("\n--- Thread-Local Data ---")

local_data = threading.local()

def thread_with_local(name: str, value: int):
    local_data.name = name
    local_data.value = value
    time.sleep(0.1)
    # Each thread sees its own values
    print(f"  Thread {local_data.name}: value={local_data.value}")

threads = [
    threading.Thread(target=thread_with_local, args=(f"T{i}", i * 10))
    for i in range(3)
]
for t in threads:
    t.start()
for t in threads:
    t.join()

# ===== BEST PRACTICES =====
print("\n--- Threading Best Practices ---")

print("""  1. Use ThreadPoolExecutor over raw threads
  2. Threads are best for I/O-bound tasks
  3. For CPU-bound, use multiprocessing instead
  4. Always protect shared state with locks
  5. Prefer immutable data or thread-local storage
  6. Use 'with' statements for locks
  7. Set reasonable pool sizes (often 4-8 workers)
  8. Handle exceptions in worker functions""")

print(f"\n  Active threads: {threading.active_count()}")
