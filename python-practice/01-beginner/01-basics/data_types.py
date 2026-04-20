"""
LESSON: Data Types
int, float, str, bool, None, complex — type checking and conversion.

Run: python3 data_types.py
"""

# ===== NUMERIC TYPES =====
print("--- Numeric Types ---")

# Integers (unlimited precision)
a = 42
big = 10 ** 50
binary = 0b1010        # 10
octal = 0o17           # 15
hexval = 0xFF          # 255
readable = 1_000_000   # underscores for readability

print(f"int: {a}, type: {type(a).__name__}")
print(f"Big int: {big}")
print(f"Binary 0b1010 = {binary}")
print(f"Octal 0o17 = {octal}")
print(f"Hex 0xFF = {hexval}")
print(f"Readable: {readable:,}")

# Floats (IEEE 754 double precision)
pi = 3.14159
scientific = 2.5e10
infinity = float('inf')
neg_inf = float('-inf')
nan = float('nan')

print(f"\nfloat: {pi}, type: {type(pi).__name__}")
print(f"Scientific: {scientific}")
print(f"Infinity: {infinity}, -Infinity: {neg_inf}")
print(f"NaN: {nan}, nan == nan: {nan == nan}")  # NaN != NaN

# Complex numbers
c = 3 + 4j
print(f"\nComplex: {c}, real: {c.real}, imag: {c.imag}")
print(f"Conjugate: {c.conjugate()}, abs: {abs(c):.2f}")

# ===== STRINGS =====
print("\n--- Strings ---")
s1 = "Hello"
s2 = 'World'
s3 = """Multi
line"""

print(f"String: {s1!r}, length: {len(s1)}")
print(f"Indexing: {s1[0]}, {s1[-1]}")
print(f"Slicing: {s1[1:4]}")
print(f"Immutable: can't do s1[0] = 'h' (would raise TypeError)")

# ===== BOOLEANS =====
print("\n--- Booleans ---")
t = True
f = False

print(f"True: {t}, type: {type(t).__name__}")
print(f"Bool is subclass of int: {issubclass(bool, int)}")
print(f"True + True = {True + True}")   # 2
print(f"True * 10 = {True * 10}")       # 10

# Truthy / Falsy values
print("\nFalsy values (bool() returns False):")
falsy = [0, 0.0, "", [], {}, set(), None, False, 0j]
for val in falsy:
    print(f"  bool({val!r:10}) = {bool(val)}")

print("\nTruthy values:")
truthy = [1, -1, "hello", [1], {"a": 1}, {1}, 0.1]
for val in truthy:
    print(f"  bool({str(val):10}) = {bool(val)}")

# ===== NONE TYPE =====
print("\n--- NoneType ---")
nothing = None
print(f"None: {nothing}, type: {type(nothing).__name__}")
print(f"None is None: {nothing is None}")   # use 'is', not '=='
print(f"bool(None): {bool(None)}")

# ===== TYPE CHECKING =====
print("\n--- Type Checking ---")
values = [42, 3.14, "hello", True, None, [1, 2], (1,), {1}, {"a": 1}]

for v in values:
    print(f"  {str(v):15} -> type: {type(v).__name__:10} "
          f"isinstance(int): {isinstance(v, int)}")

# isinstance with multiple types
print(f"\nisinstance(42, (int, float)): {isinstance(42, (int, float))}")
print(f"isinstance('hi', (int, float)): {isinstance('hi', (int, float))}")

# ===== TYPE CONVERSION =====
print("\n--- Type Conversion ---")
# To int
print(f"int('42') = {int('42')}")
print(f"int(3.99) = {int(3.99)}")       # truncates
print(f"int('0xFF', 16) = {int('0xFF', 16)}")
print(f"int('1010', 2) = {int('1010', 2)}")

# To float
print(f"float('3.14') = {float('3.14')}")
print(f"float(42) = {float(42)}")

# To string
print(f"str(42) = {str(42)!r}")
print(f"str(3.14) = {str(3.14)!r}")
print(f"str(True) = {str(True)!r}")

# To bool
print(f"bool(0) = {bool(0)}")
print(f"bool(42) = {bool(42)}")
print(f"bool('') = {bool('')}")
print(f"bool('hi') = {bool('hi')}")

# ===== BYTES TYPE =====
print("\n--- Bytes ---")
b = b"Hello"
print(f"bytes: {b}, type: {type(b).__name__}")
print(f"Decode: {b.decode('utf-8')}")
print(f"Encode: {'Hello'.encode('utf-8')}")
