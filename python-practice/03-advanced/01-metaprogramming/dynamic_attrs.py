"""
LESSON: Dynamic Attributes & Introspection
__getattr__, __setattr__, __getattribute__, __slots__, inspect module.

Run: python3 dynamic_attrs.py
"""
import inspect
from functools import cached_property

# ===== __getattr__: FALLBACK ATTRIBUTE ACCESS =====
print("--- __getattr__ ---")

class FlexibleConfig:
    """Returns None for undefined attributes instead of raising AttributeError."""

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def __getattr__(self, name):
        # Called ONLY when normal lookup fails
        return None

config = FlexibleConfig(host="localhost", port=8080)
print(f"  host: {config.host}")
print(f"  port: {config.port}")
print(f"  missing: {config.database}")  # returns None instead of error

# ===== __getattribute__: INTERCEPT ALL ACCESS =====
print("\n--- __getattribute__ ---")

class LoggedAccess:
    """Logs every attribute access."""

    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def __getattribute__(self, name):
        # Called for EVERY attribute access (be careful with recursion!)
        if not name.startswith('_'):
            print(f"  Accessing: {name}")
        return super().__getattribute__(name)

obj = LoggedAccess("Alice", 30)
_ = obj.name
_ = obj.age

# ===== __setattr__: INTERCEPT SETTING =====
print("\n--- __setattr__ ---")

class ImmutableAfterInit:
    """Attributes can only be set during __init__."""

    _frozen = False

    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y
        self._frozen = True

    def __setattr__(self, name, value):
        if name == '_frozen' or not self._frozen:
            super().__setattr__(name, value)
        else:
            raise AttributeError(f"Cannot modify '{name}': object is frozen")

frozen = ImmutableAfterInit(10, 20)
print(f"  x={frozen.x}, y={frozen.y}")

try:
    frozen.x = 99
except AttributeError as e:
    print(f"  {e}")

# ===== __delattr__ =====
print("\n--- __delattr__ ---")

class ProtectedAttrs:
    """Prevent deletion of protected attributes."""

    def __init__(self):
        self.public = "can delete"
        self._protected = "cannot delete"

    def __delattr__(self, name):
        if name.startswith('_') and not name.startswith('__'):
            raise AttributeError(f"Cannot delete protected attribute '{name}'")
        super().__delattr__(name)

obj = ProtectedAttrs()
del obj.public  # works
try:
    del obj._protected
except AttributeError as e:
    print(f"  {e}")

# ===== DYNAMIC METHOD CREATION =====
print("\n--- Dynamic Methods ---")

class DynamicAPI:
    """Creates methods dynamically based on a schema."""

    def __init__(self, endpoints: dict):
        for name, path in endpoints.items():
            # Create a method for each endpoint
            def make_method(p):
                def method(self, **params):
                    return f"GET {p} with {params}"
                return method
            setattr(self.__class__, name, make_method(path))

api = DynamicAPI({
    "get_users": "/api/users",
    "get_posts": "/api/posts",
    "get_comments": "/api/comments",
})

print(f"  {api.get_users(page=1)}")
print(f"  {api.get_posts(limit=10)}")

# ===== __slots__ =====
print("\n--- __slots__ ---")

class WithSlots:
    """Uses __slots__ for memory efficiency and attribute restriction."""
    __slots__ = ('x', 'y', 'z')

    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

class WithoutSlots:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

import sys
slotted = WithSlots(1, 2, 3)
regular = WithoutSlots(1, 2, 3)

print(f"  With __slots__:    {sys.getsizeof(slotted)} bytes")
print(f"  Without __slots__: {sys.getsizeof(regular)} + {sys.getsizeof(regular.__dict__)} (dict) bytes")

# Can't add arbitrary attributes with __slots__
try:
    slotted.w = 4
except AttributeError as e:
    print(f"  Slot restriction: {e}")

# ===== PROPERTY / CACHED_PROPERTY =====
print("\n--- property & cached_property ---")

class Circle:
    def __init__(self, radius: float):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius must be non-negative")
        self._radius = value

    @property
    def area(self):
        """Computed every time."""
        import math
        return math.pi * self._radius ** 2

    @cached_property
    def description(self):
        """Computed once, then cached."""
        print("  (Computing description...)")
        return f"Circle with radius {self._radius}"

c = Circle(5)
print(f"  Area: {c.area:.2f}")
c.radius = 10
print(f"  New area: {c.area:.2f}")
print(f"  Desc: {c.description}")
print(f"  Desc again: {c.description}")  # cached, no recompute

# ===== INSPECT MODULE =====
print("\n--- inspect Module ---")

class Example:
    """Example class for inspection."""

    class_var = 42

    def __init__(self, x: int):
        self.x = x

    def method(self, y: int) -> int:
        """Multiply x by y."""
        return self.x * y

    @staticmethod
    def static_method():
        pass

    @classmethod
    def class_method(cls):
        pass

# Inspect members
members = inspect.getmembers(Example, predicate=inspect.isfunction)
print(f"  Functions: {[name for name, _ in members]}")

# Inspect signature
sig = inspect.signature(Example.method)
print(f"  method signature: {sig}")
print(f"  Parameters: {list(sig.parameters.keys())}")

# Get source
source_lines = inspect.getsource(Example.method)
print(f"  Source:\n{source_lines}")

# Check types
print(f"  Is class: {inspect.isclass(Example)}")
print(f"  Is method: {inspect.ismethod(Example.method)}")

# ===== PRACTICAL: ATTRIBUTE PROXY =====
print("\n--- Attribute Proxy ---")

class AttributeProxy:
    """Proxies attribute access to a wrapped object with logging."""

    def __init__(self, target):
        object.__setattr__(self, '_target', target)
        object.__setattr__(self, '_access_log', [])

    def __getattr__(self, name):
        self._access_log.append(('get', name))
        return getattr(self._target, name)

    def __setattr__(self, name, value):
        if name.startswith('_'):
            object.__setattr__(self, name, value)
        else:
            self._access_log.append(('set', name, value))
            setattr(self._target, name, value)

    def get_log(self):
        return self._access_log

class RealDatabase:
    def __init__(self):
        self.host = "localhost"
        self.port = 5432

    def connect(self):
        return f"Connected to {self.host}:{self.port}"

db = AttributeProxy(RealDatabase())
print(f"  {db.connect()}")
db.host = "remote-server"
print(f"  {db.connect()}")
print(f"  Access log: {db.get_log()}")
