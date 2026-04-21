"""
LESSON: Dunder (Magic) Methods
__eq__, __lt__, __hash__, __len__, __getitem__, __setitem__, __contains__, __call__.

Run: python3 dunder_methods.py
"""
from functools import total_ordering

# ===== COMPARISON METHODS =====
print("--- Comparison Methods ---")

@total_ordering  # auto-generates __le__, __gt__, __ge__ from __eq__ and __lt__
class Student:
    def __init__(self, name: str, gpa: float):
        self.name = name
        self.gpa = gpa

    def __eq__(self, other):
        if not isinstance(other, Student):
            return NotImplemented
        return self.gpa == other.gpa

    def __lt__(self, other):
        if not isinstance(other, Student):
            return NotImplemented
        return self.gpa < other.gpa

    def __hash__(self):
        return hash((self.name, self.gpa))

    def __repr__(self):
        return f"Student({self.name!r}, {self.gpa})"

s1 = Student("Alice", 3.9)
s2 = Student("Bob", 3.5)
s3 = Student("Charlie", 3.9)

print(f"s1 == s3: {s1 == s3}")   # same GPA
print(f"s1 > s2:  {s1 > s2}")
print(f"s2 < s1:  {s2 < s1}")
print(f"sorted: {sorted([s1, s2, s3])}")

# Hashable — can use in sets/dicts
students_set = {s1, s2, s3}
print(f"Set: {students_set}")

# ===== CONTAINER METHODS =====
print("\n--- Container Methods ---")

class Inventory:
    def __init__(self):
        self._items: dict[str, int] = {}

    def add(self, item: str, qty: int = 1):
        self._items[item] = self._items.get(item, 0) + qty

    def __len__(self) -> int:
        """len(inventory)"""
        return sum(self._items.values())

    def __contains__(self, item: str) -> bool:
        """'sword' in inventory"""
        return item in self._items

    def __getitem__(self, item: str) -> int:
        """inventory['sword']"""
        return self._items.get(item, 0)

    def __setitem__(self, item: str, qty: int):
        """inventory['sword'] = 5"""
        self._items[item] = qty

    def __delitem__(self, item: str):
        """del inventory['sword']"""
        if item in self._items:
            del self._items[item]

    def __iter__(self):
        """for item in inventory"""
        return iter(self._items)

    def __repr__(self):
        return f"Inventory({self._items})"

inv = Inventory()
inv.add("sword", 2)
inv.add("shield", 1)
inv.add("potion", 5)

print(f"Inventory: {inv}")
print(f"len(inv): {len(inv)}")
print(f"'sword' in inv: {'sword' in inv}")
print(f"inv['potion']: {inv['potion']}")

inv['arrows'] = 20
print(f"After inv['arrows'] = 20: {inv}")

del inv['shield']
print(f"After del inv['shield']: {inv}")

print("Items:", end=" ")
for item in inv:
    print(f"{item}({inv[item]})", end=" ")
print()

# ===== __CALL__ =====
print("\n--- __call__ (Callable Objects) ---")

class Multiplier:
    def __init__(self, factor: int):
        self.factor = factor

    def __call__(self, value: int) -> int:
        return value * self.factor

double = Multiplier(2)
triple = Multiplier(3)

print(f"double(5) = {double(5)}")
print(f"triple(5) = {triple(5)}")
print(f"callable(double): {callable(double)}")

# Practical: function with state
class RunningAverage:
    def __init__(self):
        self._values: list[float] = []

    def __call__(self, value: float) -> float:
        self._values.append(value)
        return sum(self._values) / len(self._values)

    def __repr__(self):
        return f"RunningAverage(n={len(self._values)}, avg={self():.2f})" if self._values else "RunningAverage(empty)"

avg = RunningAverage()
for v in [10, 20, 30, 40, 50]:
    print(f"  add {v}: average = {avg(v):.1f}")

# ===== ARITHMETIC METHODS =====
print("\n--- Arithmetic Methods ---")

class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar: float):
        return Vector(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar: float):
        return self.__mul__(scalar)

    def __abs__(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

    def __neg__(self):
        return Vector(-self.x, -self.y)

    def __bool__(self):
        return self.x != 0 or self.y != 0

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(3, 4)
v2 = Vector(1, 2)

print(f"v1 = {v1}")
print(f"v2 = {v2}")
print(f"v1 + v2 = {v1 + v2}")
print(f"v1 - v2 = {v1 - v2}")
print(f"v1 * 3 = {v1 * 3}")
print(f"3 * v1 = {3 * v1}")     # uses __rmul__
print(f"|v1| = {abs(v1):.2f}")
print(f"-v1 = {-v1}")
print(f"bool(Vector(0,0)): {bool(Vector(0, 0))}")

# ===== CONTEXT: __enter__ / __exit__ =====
print("\n--- __enter__ / __exit__ (preview) ---")
print("See context_managers.py for full coverage")

# ===== SUMMARY =====
print("\n--- Key Dunder Methods ---")
methods = [
    ("__init__",     "Constructor"),
    ("__str__",      "str() / print()"),
    ("__repr__",     "repr() / debugger"),
    ("__eq__/__lt__","Comparisons"),
    ("__hash__",     "hash() / set/dict key"),
    ("__len__",      "len()"),
    ("__getitem__",  "obj[key]"),
    ("__setitem__",  "obj[key] = val"),
    ("__contains__", "x in obj"),
    ("__iter__",     "for x in obj"),
    ("__call__",     "obj()"),
    ("__add__",      "obj + other"),
    ("__bool__",     "bool(obj) / if obj"),
]
for name, usage in methods:
    print(f"  {name:<15} -> {usage}")
