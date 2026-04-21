"""
LESSON: CPython Internals
Object model, reference counting, GC, interning, bytecode, memory layout.

Run: python3 cpython_internals.py
"""
import sys
import gc
import dis
import ctypes

# ===== EVERYTHING IS AN OBJECT =====
print("--- Everything is an Object ---")

# In CPython, everything is a PyObject (C struct)
items = [42, 3.14, "hello", [1, 2], lambda x: x, type, None]
for item in items:
    print(f"  {str(item):20s} type={type(item).__name__:10s} id={id(item)}")

# id() returns the memory address in CPython
x = 42
print(f"\n  id(42) = {id(x)} (memory address in CPython)")

# ===== REFERENCE COUNTING =====
print("\n--- Reference Counting ---")

# sys.getrefcount() shows reference count (+1 for the argument itself)
a = [1, 2, 3]
print(f"  refcount after creation: {sys.getrefcount(a) - 1}")

b = a  # another reference
print(f"  refcount after b = a:    {sys.getrefcount(a) - 1}")

c = [a, a, a]  # three more references
print(f"  refcount after list:     {sys.getrefcount(a) - 1}")

del b
print(f"  refcount after del b:    {sys.getrefcount(a) - 1}")

del c
print(f"  refcount after del c:    {sys.getrefcount(a) - 1}")

# ===== INTEGER INTERNING =====
print("\n--- Integer Interning ---")

# CPython interns integers -5 to 256
a = 256
b = 256
print(f"  256 is 256: {a is b}")  # True (interned)

a = 257
b = 257
# In interactive mode these would be different objects,
# but in a script they may be the same due to compiler optimization
print(f"  257 is 257: {a is b}")  # May be True in scripts

# String interning
s1 = "hello"
s2 = "hello"
print(f"  'hello' is 'hello': {s1 is s2}")  # True (interned)

s1 = "hello world!"
s2 = "hello world!"
print(f"  'hello world!' is 'hello world!': {s1 is s2}")

# ===== OBJECT SIZE =====
print("\n--- Object Sizes ---")

objects = {
    "None": None,
    "True": True,
    "int(0)": 0,
    "int(1)": 1,
    "int(2**30)": 2**30,
    "int(2**100)": 2**100,
    "float(0.0)": 0.0,
    "''": "",
    "'hello'": "hello",
    "'a' * 100": "a" * 100,
    "[]": [],
    "[1,2,3]": [1, 2, 3],
    "{}": {},
    "set()": set(),
    "tuple()": (),
    "(1,2,3)": (1, 2, 3),
}

for name, obj in objects.items():
    size = sys.getsizeof(obj)
    print(f"  {name:20s}: {size:6d} bytes")

# ===== GARBAGE COLLECTION =====
print("\n--- Garbage Collection ---")

print(f"  GC enabled: {gc.isenabled()}")
print(f"  GC thresholds: {gc.get_threshold()}")
print(f"  GC counts: {gc.get_count()}")

# Create a reference cycle
class Node:
    def __init__(self, name):
        self.name = name
        self.ref = None
    def __del__(self):
        pass  # destructor

# Reference cycle: a → b → a
a = Node("A")
b = Node("B")
a.ref = b
b.ref = a

# Delete external references
del a
del b
# Objects still alive due to cycle! GC will collect them

collected = gc.collect()
print(f"  GC collected {collected} objects")

# ===== BYTECODE / DISASSEMBLY =====
print("\n--- Bytecode Disassembly ---")

def add(a, b):
    return a + b

print("  Disassembly of add(a, b):")
dis.dis(add)

# More complex example
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print("\n  Disassembly of factorial(n):")
dis.dis(factorial)

# ===== CODE OBJECT =====
print("\n--- Code Object ---")

code = add.__code__
print(f"  co_name:      {code.co_name}")
print(f"  co_varnames:  {code.co_varnames}")
print(f"  co_argcount:  {code.co_argcount}")
print(f"  co_consts:    {code.co_consts}")
print(f"  co_stacksize: {code.co_stacksize}")
print(f"  co_bytecode:  {code.co_code.hex()}")

# ===== __dict__ AND __slots__ =====
print("\n--- __dict__ vs __slots__ ---")

class WithDict:
    def __init__(self):
        self.x = 1
        self.y = 2

class WithSlots:
    __slots__ = ('x', 'y')
    def __init__(self):
        self.x = 1
        self.y = 2

wd = WithDict()
ws = WithSlots()

print(f"  WithDict.__dict__: {wd.__dict__}")
print(f"  WithDict size: {sys.getsizeof(wd) + sys.getsizeof(wd.__dict__)} bytes")
print(f"  WithSlots size: {sys.getsizeof(ws)} bytes")
print(f"  WithSlots has __dict__: {hasattr(ws, '__dict__')}")

# ===== MRO (Method Resolution Order) =====
print("\n--- MRO (C3 Linearization) ---")

class A: pass
class B(A): pass
class C(A): pass
class D(B, C): pass

print(f"  D MRO: {[cls.__name__ for cls in D.__mro__]}")

# Diamond problem
class Base:
    def method(self):
        return "Base"

class Left(Base):
    def method(self):
        return "Left"

class Right(Base):
    def method(self):
        return "Right"

class Diamond(Left, Right):
    pass

d = Diamond()
print(f"  Diamond.method(): {d.method()}")  # Left (follows MRO)
print(f"  Diamond MRO: {[c.__name__ for c in Diamond.__mro__]}")

# ===== SMALL OBJECT ALLOCATOR =====
print("\n--- Memory Allocator ---")

print("""  CPython memory layers:
  ┌─────────────────────────┐
  │  Python object allocator │ ← PyObject_Malloc
  │  (pymalloc: < 512 bytes)│
  ├─────────────────────────┤
  │  Python memory allocator │ ← PyMem_Malloc
  ├─────────────────────────┤
  │  C library malloc()      │ ← OS level
  └─────────────────────────┘

  - Objects < 512 bytes use pymalloc (arena-based)
  - Arenas = 256KB memory pools
  - Pools = 4KB blocks for same-size objects
  - Very efficient for many small objects""")

# ===== IMPORTANT INTERNAL DETAILS =====
print("\n--- Key CPython Details ---")

print(f"""  Python version: {sys.version}
  Implementation: {sys.implementation.name}
  Max recursion: {sys.getrecursionlimit()}
  Int max str digits: {sys.get_int_max_str_digits()}
  Float info: max={sys.float_info.max:.2e}, epsilon={sys.float_info.epsilon}
  Hash randomization seed: PYTHONHASHSEED (set for security)""")
