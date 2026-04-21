"""
LESSON: Asyncio Basics
async/await, coroutines, tasks, gather, event loop, async patterns.

Run: python3 asyncio_basics.py
"""
import asyncio
import time

# ===== BASIC COROUTINE =====
print("--- Basic Coroutine ---")

async def say_hello(name: str) -> str:
    """A coroutine is defined with 'async def'."""
    print(f"  Hello, {name}!")
    return f"greeted {name}"

# Run a single coroutine
result = asyncio.run(say_hello("World"))
print(f"  Result: {result}")

# ===== AWAIT =====
print("\n--- await ---")

async def fetch_data(item: str, delay: float) -> dict:
    """Simulate an async I/O operation."""
    print(f"  Fetching {item}...")
    await asyncio.sleep(delay)  # non-blocking sleep
    print(f"  Got {item}")
    return {"item": item, "status": "ok"}

async def main_await():
    # await suspends until the coroutine completes
    result = await fetch_data("users", 0.2)
    print(f"  Result: {result}")

asyncio.run(main_await())

# ===== CONCURRENT EXECUTION WITH GATHER =====
print("\n--- asyncio.gather ---")

async def main_gather():
    start = time.perf_counter()

    # Run multiple coroutines concurrently
    results = await asyncio.gather(
        fetch_data("users", 0.3),
        fetch_data("posts", 0.2),
        fetch_data("comments", 0.1),
    )

    elapsed = time.perf_counter() - start
    print(f"  All done in {elapsed:.2f}s (not {0.3+0.2+0.1:.1f}s)")
    for r in results:
        print(f"    {r}")

asyncio.run(main_gather())

# ===== TASKS =====
print("\n--- asyncio.create_task ---")

async def background_worker(name: str, count: int):
    for i in range(count):
        print(f"  [{name}] Step {i+1}/{count}")
        await asyncio.sleep(0.1)
    return f"{name} completed"

async def main_tasks():
    # Create tasks — they start running immediately
    task1 = asyncio.create_task(background_worker("A", 3))
    task2 = asyncio.create_task(background_worker("B", 2))

    # Do other work while tasks run
    print("  [Main] Tasks started, doing other work...")
    await asyncio.sleep(0.05)
    print("  [Main] Waiting for tasks...")

    # Wait for results
    result1 = await task1
    result2 = await task2
    print(f"  Results: {result1}, {result2}")

asyncio.run(main_tasks())

# ===== TIMEOUTS =====
print("\n--- Timeouts ---")

async def slow_operation():
    await asyncio.sleep(5)
    return "done"

async def main_timeout():
    try:
        result = await asyncio.wait_for(slow_operation(), timeout=0.5)
    except asyncio.TimeoutError:
        print("  Operation timed out! ⏰")

asyncio.run(main_timeout())

# ===== ASYNC FOR =====
print("\n--- Async Iteration ---")

async def async_range(start: int, stop: int, delay: float = 0.05):
    """Async generator."""
    for i in range(start, stop):
        await asyncio.sleep(delay)
        yield i

async def main_async_for():
    values = []
    async for num in async_range(1, 6):
        values.append(num)
    print(f"  Async values: {values}")

asyncio.run(main_async_for())

# ===== ASYNC CONTEXT MANAGER =====
print("\n--- Async Context Manager ---")

class AsyncConnection:
    """Simulates an async database connection."""

    def __init__(self, name: str):
        self.name = name

    async def __aenter__(self):
        print(f"  Opening connection: {self.name}")
        await asyncio.sleep(0.1)  # simulate connect
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print(f"  Closing connection: {self.name}")
        await asyncio.sleep(0.05)  # simulate disconnect
        return False

    async def query(self, sql: str) -> list:
        await asyncio.sleep(0.05)
        return [{"id": 1, "data": f"result for: {sql}"}]

async def main_async_ctx():
    async with AsyncConnection("postgres") as conn:
        results = await conn.query("SELECT * FROM users")
        print(f"  Query results: {results}")

asyncio.run(main_async_ctx())

# ===== SEMAPHORE: LIMIT CONCURRENCY =====
print("\n--- Semaphore ---")

async def rate_limited_fetch(sem: asyncio.Semaphore, url: str) -> str:
    async with sem:
        print(f"  Fetching: {url}")
        await asyncio.sleep(0.2)
        return f"data from {url}"

async def main_semaphore():
    sem = asyncio.Semaphore(2)  # max 2 concurrent requests

    urls = [f"https://api.example.com/{i}" for i in range(5)]
    start = time.perf_counter()

    tasks = [rate_limited_fetch(sem, url) for url in urls]
    results = await asyncio.gather(*tasks)

    elapsed = time.perf_counter() - start
    print(f"  Fetched {len(results)} URLs in {elapsed:.2f}s (limited to 2 concurrent)")

asyncio.run(main_semaphore())

# ===== ERROR HANDLING =====
print("\n--- Error Handling ---")

async def might_fail(name: str, should_fail: bool):
    await asyncio.sleep(0.1)
    if should_fail:
        raise ValueError(f"{name} failed!")
    return f"{name} succeeded"

async def main_errors():
    # gather with return_exceptions=True
    results = await asyncio.gather(
        might_fail("task1", False),
        might_fail("task2", True),
        might_fail("task3", False),
        return_exceptions=True,
    )

    for i, result in enumerate(results):
        if isinstance(result, Exception):
            print(f"  Task {i+1}: ERROR - {result}")
        else:
            print(f"  Task {i+1}: {result}")

asyncio.run(main_errors())

# ===== ASYNC QUEUE =====
print("\n--- Async Queue (Producer/Consumer) ---")

async def producer(queue: asyncio.Queue, items: list):
    for item in items:
        await queue.put(item)
        print(f"  Produced: {item}")
        await asyncio.sleep(0.05)
    await queue.put(None)  # sentinel

async def consumer(queue: asyncio.Queue, name: str):
    while True:
        item = await queue.get()
        if item is None:
            break
        print(f"  [{name}] Consumed: {item}")
        await asyncio.sleep(0.1)
        queue.task_done()

async def main_queue():
    queue = asyncio.Queue(maxsize=3)

    await asyncio.gather(
        producer(queue, ["apple", "banana", "cherry", "date"]),
        consumer(queue, "Worker"),
    )

asyncio.run(main_queue())

# ===== PRACTICAL: ASYNC HTTP PATTERN =====
print("\n--- Async HTTP Pattern ---")

async def async_http_get(url: str) -> dict:
    """Simulates aiohttp.get() pattern."""
    await asyncio.sleep(0.1)
    return {"url": url, "status": 200, "body": f"data from {url}"}

async def fetch_all_pages():
    urls = [f"https://example.com/page/{i}" for i in range(1, 5)]

    async def fetch_one(url):
        response = await async_http_get(url)
        return response

    tasks = [fetch_one(url) for url in urls]
    results = await asyncio.gather(*tasks)

    for r in results:
        print(f"  {r['url']}: status={r['status']}")

asyncio.run(fetch_all_pages())
