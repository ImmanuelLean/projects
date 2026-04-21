"""
LESSON: Descriptors
__get__, __set__, __delete__, descriptor protocol, cached_property.

Run: python3 descriptors.py
"""
from functools import cached_property

# ===== BASIC DESCRIPTOR =====
print("--- Basic Descriptor ---")

class Verbose:
    """A descriptor that logs all access."""

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        value = obj.__dict__.get(self.name)
        print(f"  GET {self.name} -> {value}")
        return value

    def __set__(self, obj, value):
        print(f"  SET {self.name} = {value}")
        obj.__dict__[self.name] = value

    def __delete__(self, obj):
        print(f"  DEL {self.name}")
        del obj.__dict__[self.name]

class MyClass:
    attr = Verbose()

obj = MyClass()
obj.attr = 42      # triggers __set__
_ = obj.attr       # triggers __get__
del obj.attr       # triggers __delete__

# ===== VALIDATED DESCRIPTOR =====
print("\n--- Validated Descriptor ---")

class Validated:
    """Descriptor with type and range validation."""

    def __init__(self, type_=None, min_val=None, max_val=None):
        self.type_ = type_
        self.min_val = min_val
        self.max_val = max_val

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.name)

    def __set__(self, obj, value):
        if self.type_ and not isinstance(value, self.type_):
            raise TypeError(f"{self.name} must be {self.type_.__name__}, got {type(value).__name__}")
        if self.min_val is not None and value < self.min_val:
            raise ValueError(f"{self.name} must be >= {self.min_val}")
        if self.max_val is not None and value > self.max_val:
            raise ValueError(f"{self.name} must be <= {self.max_val}")
        obj.__dict__[self.name] = value

class Student:
    name = Validated(type_=str)
    age = Validated(type_=int, min_val=0, max_val=150)
    gpa = Validated(type_=float, min_val=0.0, max_val=4.0)

    def __init__(self, name: str, age: int, gpa: float):
        self.name = name
        self.age = age
        self.gpa = gpa

    def __repr__(self):
        return f"Student({self.name!r}, age={self.age}, gpa={self.gpa})"

s = Student("Emmanuel", 20, 3.8)
print(f"Valid: {s}")

for desc, setter in [
    ("bad type", lambda: setattr(s, 'age', '20')),
    ("too low",  lambda: setattr(s, 'age', -5)),
    ("too high", lambda: setattr(s, 'gpa', 5.0)),
]:
    try:
        setter()
    except (TypeError, ValueError) as e:
        print(f"  {desc}: {e}")

# ===== NON-DATA vs DATA DESCRIPTORS =====
print("\n--- Data vs Non-Data Descriptors ---")
print("Data descriptor:     has __get__ AND __set__  -> takes priority over instance dict")
print("Non-data descriptor: has only __get__         -> instance dict takes priority")

class NonDataDesc:
    def __get__(self, obj, objtype=None):
        return "from descriptor"

class DataDesc:
    def __get__(self, obj, objtype=None):
        return obj.__dict__.get('val', 'from descriptor')

    def __set__(self, obj, value):
        obj.__dict__['val'] = value

class Demo:
    non_data = NonDataDesc()
    data = DataDesc()

d = Demo()
print(f"\nNon-data: {d.non_data}")
d.__dict__['non_data'] = "from instance"
print(f"Non-data after instance set: {d.non_data}")  # instance wins

print(f"\nData: {d.data}")
d.data = "set via descriptor"
print(f"Data after set: {d.data}")  # descriptor controls access

# ===== CACHED PROPERTY =====
print("\n--- cached_property ---")

class DataAnalyzer:
    def __init__(self, data: list[int]):
        self._data = data

    @cached_property
    def stats(self) -> dict:
        """Computed once, then cached in instance dict."""
        print("  Computing stats (expensive)...")
        return {
            "mean": sum(self._data) / len(self._data),
            "min": min(self._data),
            "max": max(self._data),
            "count": len(self._data),
        }

analyzer = DataAnalyzer([10, 20, 30, 40, 50])
print(f"First access: {analyzer.stats}")   # computes
print(f"Second access: {analyzer.stats}")   # cached, no recomputation

# ===== PRACTICAL: LAZY ATTRIBUTE =====
print("\n--- Practical: Lazy Attribute ---")

class LazyProperty:
    """Descriptor that computes value on first access and caches it."""

    def __init__(self, func):
        self.func = func
        self.name = func.__name__

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        value = self.func(obj)
        setattr(obj, self.name, value)  # replaces descriptor in instance dict
        return value

class ExpensiveResource:
    @LazyProperty
    def connection(self):
        print("  Establishing connection...")
        return {"status": "connected", "id": 42}

    @LazyProperty
    def config(self):
        print("  Loading config...")
        return {"debug": True, "port": 8080}

r = ExpensiveResource()
print("Before access: nothing loaded")
print(f"connection: {r.connection}")    # computed
print(f"connection: {r.connection}")    # cached
print(f"config: {r.config}")           # computed
