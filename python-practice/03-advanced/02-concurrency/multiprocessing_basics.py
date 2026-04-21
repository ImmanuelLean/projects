"""
LESSON: Multiprocessing
Process, Pool, shared state, queues, CPU-bound parallelism.

Run: python3 multiprocessing_basics.py
"""
import multiprocessing as mp
import time
import os
from concurrent.futures import ProcessPoolExecutor, as_completed

# ===== BASIC PROCESS =====
print("--- Basic Process ---")

def worker(name: str):
    """Function that runs in a separate process."""
    pid = os.getpid()
    print(f"  [{name}] PID: {pid}, Parent PID: {os.getppid()}")
    time.sleep(0.2)
    print(f"  [{name}] Done")

if __name__ == "__main__":
    print(f"  Main PID: {os.getpid()}")

    p1 = mp.Process(target=worker, args=("Process-A",))
    p2 = mp.Process(target=worker, args=("Process-B",))

    p1.start()
    p2.start()

    p1.join()
    p2.join()
    print("  Both processes completed")

    # ===== CPU-BOUND: THREADING VS MULTIPROCESSING =====
    print("\n--- CPU-Bound Comparison ---")

    def cpu_intensive(n: int) -> int:
        """CPU-bound task: sum of squares."""
        return sum(i * i for i in range(n))

    N = 2_000_000

    # Sequential
    start = time.perf_counter()
    results = [cpu_intensive(N) for _ in range(4)]
    seq_time = time.perf_counter() - start

    # Multiprocessing
    start = time.perf_counter()
    with ProcessPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(cpu_intensive, [N] * 4))
    mp_time = time.perf_counter() - start

    print(f"  Sequential:      {seq_time:.2f}s")
    print(f"  Multiprocessing: {mp_time:.2f}s")
    print(f"  Speedup:         {seq_time/mp_time:.1f}x")

    # ===== POOL =====
    print("\n--- multiprocessing.Pool ---")

    def square(x: int) -> int:
        return x * x

    with mp.Pool(processes=4) as pool:
        # map: ordered results
        results = pool.map(square, range(10))
        print(f"  pool.map: {results}")

        # imap: lazy iterator (saves memory)
        results = list(pool.imap(square, range(5)))
        print(f"  pool.imap: {results}")

        # apply_async: single task, non-blocking
        async_result = pool.apply_async(square, (42,))
        print(f"  apply_async: {async_result.get(timeout=5)}")

    # ===== ProcessPoolExecutor =====
    print("\n--- ProcessPoolExecutor ---")

    def factorize(n: int) -> list:
        """Find all factors of n."""
        factors = []
        for i in range(1, int(n**0.5) + 1):
            if n % i == 0:
                factors.append(i)
                if i != n // i:
                    factors.append(n // i)
        return sorted(factors)

    numbers = [1_000_003, 999_983, 1_000_033, 999_979]

    with ProcessPoolExecutor(max_workers=4) as executor:
        future_to_num = {
            executor.submit(factorize, n): n for n in numbers
        }

        for future in as_completed(future_to_num):
            num = future_to_num[future]
            factors = future.result()
            print(f"  {num}: {len(factors)} factors → {factors[:5]}...")

    # ===== SHARED STATE: VALUE AND ARRAY =====
    print("\n--- Shared State ---")

    def increment_counter(counter, lock, n):
        for _ in range(n):
            with lock:
                counter.value += 1

    counter = mp.Value('i', 0)  # 'i' = integer
    lock = mp.Lock()

    processes = [
        mp.Process(target=increment_counter, args=(counter, lock, 10_000))
        for _ in range(4)
    ]

    for p in processes:
        p.start()
    for p in processes:
        p.join()

    print(f"  Shared counter: {counter.value} (expected 40,000)")

    # Shared Array
    shared_array = mp.Array('d', [0.0, 0.0, 0.0])  # 'd' = double

    def fill_array(arr, index, value):
        arr[index] = value

    procs = [
        mp.Process(target=fill_array, args=(shared_array, i, i * 1.5))
        for i in range(3)
    ]
    for p in procs:
        p.start()
    for p in procs:
        p.join()

    print(f"  Shared array: {list(shared_array)}")

    # ===== QUEUE =====
    print("\n--- multiprocessing.Queue ---")

    def producer(queue: mp.Queue, items: list):
        for item in items:
            queue.put(item)
            time.sleep(0.05)
        queue.put(None)  # sentinel

    def consumer(queue: mp.Queue, results: list):
        while True:
            item = queue.get()
            if item is None:
                break
            results.append(item.upper())

    q = mp.Queue()
    manager = mp.Manager()
    result_list = manager.list()

    prod = mp.Process(target=producer, args=(q, ["hello", "world", "python"]))
    cons = mp.Process(target=consumer, args=(q, result_list))

    prod.start()
    cons.start()

    prod.join()
    cons.join()

    print(f"  Processed: {list(result_list)}")

    # ===== PIPE =====
    print("\n--- multiprocessing.Pipe ---")

    def sender(conn):
        messages = ["msg1", "msg2", "msg3"]
        for msg in messages:
            conn.send(msg)
            time.sleep(0.05)
        conn.send(None)
        conn.close()

    def receiver(conn):
        received = []
        while True:
            msg = conn.recv()
            if msg is None:
                break
            received.append(msg)
        conn.close()
        return received

    parent_conn, child_conn = mp.Pipe()

    p_send = mp.Process(target=sender, args=(child_conn,))
    p_send.start()

    # Receive in main process
    received = []
    while True:
        msg = parent_conn.recv()
        if msg is None:
            break
        received.append(msg)

    p_send.join()
    print(f"  Received via Pipe: {received}")

    # ===== BEST PRACTICES =====
    print("\n--- Multiprocessing Best Practices ---")

    print(f"""  1. Use ProcessPoolExecutor for simple parallel tasks
  2. Always guard with `if __name__ == '__main__'`
  3. Multiprocessing for CPU-bound, threading for I/O-bound
  4. Minimize data transfer between processes (serialization cost)
  5. Use Queues or Pipes for inter-process communication
  6. Shared memory (Value/Array) for simple shared state
  7. Manager objects for complex shared data structures
  8. CPU count: {mp.cpu_count()} cores available""")
