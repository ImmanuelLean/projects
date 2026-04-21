"""
LESSON: Context Managers
__enter__/__exit__, contextlib, @contextmanager, suppressing exceptions.

Run: python3 context_managers.py
"""
import time
from contextlib import contextmanager, suppress

# ===== CLASS-BASED CONTEXT MANAGER =====
print("--- Class-Based Context Manager ---")

class Timer:
    """Measure execution time of a code block."""

    def __init__(self, label: str = "Block"):
        self.label = label
        self.elapsed = 0.0

    def __enter__(self):
        self.start = time.perf_counter()
        print(f"  [{self.label}] Starting...")
        return self  # returned value is bound to 'as' variable

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.elapsed = time.perf_counter() - self.start
        print(f"  [{self.label}] Finished in {self.elapsed:.4f}s")
        return False  # don't suppress exceptions

with Timer("Sum") as t:
    total = sum(range(1_000_000))
print(f"  Result: {total}, took {t.elapsed:.4f}s")

# ===== EXCEPTION HANDLING IN __exit__ =====
print("\n--- Exception Handling ---")

class SafeBlock:
    """Catches and logs exceptions instead of propagating."""

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            print(f"  Caught {exc_type.__name__}: {exc_val}")
            return True  # True = suppress the exception
        return False

with SafeBlock():
    print("  This runs fine")

with SafeBlock():
    raise ValueError("Something went wrong!")
print("  Continued after suppressed exception")

# ===== FILE-LIKE CONTEXT MANAGER =====
print("\n--- File-Like Context Manager ---")

class ManagedFile:
    def __init__(self, path: str, mode: str = 'w'):
        self.path = path
        self.mode = mode

    def __enter__(self):
        print(f"  Opening {self.path}")
        self.file = open(self.path, self.mode)
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"  Closing {self.path}")
        self.file.close()
        return False

import tempfile, os
tmp = os.path.join(tempfile.gettempdir(), "managed_test.txt")

with ManagedFile(tmp) as f:
    f.write("Hello from ManagedFile!\n")

with ManagedFile(tmp, 'r') as f:
    print(f"  Content: {f.read().strip()}")

os.unlink(tmp)

# ===== @contextmanager DECORATOR =====
print("\n--- @contextmanager (Generator-Based) ---")

@contextmanager
def timer(label: str = "Block"):
    """Same as Timer class but as a generator."""
    start = time.perf_counter()
    print(f"  [{label}] Starting...")
    try:
        yield  # code in 'with' block runs here
    finally:
        elapsed = time.perf_counter() - start
        print(f"  [{label}] Finished in {elapsed:.4f}s")

with timer("Loop"):
    total = sum(x ** 2 for x in range(100_000))

# Yielding a value
@contextmanager
def temp_directory():
    """Create and clean up a temporary directory."""
    import tempfile, shutil
    path = tempfile.mkdtemp()
    print(f"  Created temp dir: {path}")
    try:
        yield path
    finally:
        shutil.rmtree(path)
        print(f"  Cleaned up: {path}")

with temp_directory() as tmpdir:
    filepath = os.path.join(tmpdir, "test.txt")
    with open(filepath, 'w') as f:
        f.write("temporary data")
    print(f"  Wrote to: {filepath}")

# ===== CONTEXTLIB.SUPPRESS =====
print("\n--- contextlib.suppress ---")

# Instead of try/except/pass
with suppress(FileNotFoundError):
    os.unlink("/tmp/nonexistent_file_12345.txt")
print("  suppress: FileNotFoundError was silently ignored")

with suppress(KeyError, IndexError):
    d = {"a": 1}
    val = d["missing"]
print("  suppress: KeyError silently ignored")

# ===== NESTED CONTEXT MANAGERS =====
print("\n--- Nested Context Managers ---")

@contextmanager
def indent(level: int = 1):
    prefix = "  " * level
    print(f"{prefix}> entering level {level}")
    yield prefix
    print(f"{prefix}< exiting level {level}")

with indent(1) as p1:
    print(f"{p1}Working at level 1")
    with indent(2) as p2:
        print(f"{p2}Working at level 2")
        with indent(3) as p3:
            print(f"{p3}Working at level 3")

# ===== PRACTICAL: DATABASE TRANSACTION =====
print("\n--- Practical: Transaction Pattern ---")

class Transaction:
    def __init__(self, name: str):
        self.name = name
        self.operations: list[str] = []

    def __enter__(self):
        print(f"  BEGIN TRANSACTION '{self.name}'")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            print(f"  ROLLBACK '{self.name}': {exc_val}")
            self.operations.clear()
            return True  # suppress
        else:
            print(f"  COMMIT '{self.name}': {self.operations}")
        return False

    def execute(self, op: str):
        self.operations.append(op)
        print(f"  Execute: {op}")

# Successful transaction
with Transaction("transfer") as tx:
    tx.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
    tx.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 2")

# Failed transaction
with Transaction("bad_transfer") as tx:
    tx.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
    raise RuntimeError("Connection lost!")
