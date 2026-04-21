"""
LESSON: Advanced Descriptors
Data vs non-data descriptors, __set_name__, validation descriptors, ORM-style fields.

Run: python3 descriptors_advanced.py
"""

# ===== DESCRIPTOR PROTOCOL =====
print("--- Descriptor Protocol ---")

# A descriptor is any object that implements __get__, __set__, or __delete__
# Data descriptor: has __set__ or __delete__ (takes priority over instance __dict__)
# Non-data descriptor: only has __get__ (instance __dict__ wins)

class Verbose:
    """A descriptor that logs all access."""

    def __set_name__(self, owner, name):
        # Called automatically when class is created (Python 3.6+)
        self.name = name
        self.private_name = f"_{name}"
        print(f"  Descriptor '{name}' bound to {owner.__name__}")

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self  # accessed from class, not instance
        value = getattr(obj, self.private_name, None)
        print(f"  __get__ {self.name} → {value!r}")
        return value

    def __set__(self, obj, value):
        print(f"  __set__ {self.name} = {value!r}")
        setattr(obj, self.private_name, value)

    def __delete__(self, obj):
        print(f"  __delete__ {self.name}")
        delattr(obj, self.private_name)

class MyModel:
    x = Verbose()
    y = Verbose()

m = MyModel()
m.x = 10
m.y = 20
_ = m.x

# ===== VALIDATED DESCRIPTOR =====
print("\n--- Validated Descriptor ---")

class Validated:
    """Base class for validated descriptors."""

    def __set_name__(self, owner, name):
        self.name = name
        self.private_name = f"_{name}"

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private_name, self.default)

    def __set__(self, obj, value):
        self.validate(value)
        setattr(obj, self.private_name, value)

    def validate(self, value):
        raise NotImplementedError

    @property
    def default(self):
        return None


class PositiveInt(Validated):
    """Must be a positive integer."""

    @property
    def default(self):
        return 0

    def validate(self, value):
        if not isinstance(value, int):
            raise TypeError(f"{self.name} must be int, got {type(value).__name__}")
        if value <= 0:
            raise ValueError(f"{self.name} must be positive, got {value}")


class NonEmptyString(Validated):
    """Must be a non-empty string."""

    @property
    def default(self):
        return ""

    def validate(self, value):
        if not isinstance(value, str):
            raise TypeError(f"{self.name} must be str, got {type(value).__name__}")
        if not value.strip():
            raise ValueError(f"{self.name} cannot be empty")


class InRange(Validated):
    """Must be a number within a range."""

    def __init__(self, min_val: float, max_val: float):
        self.min_val = min_val
        self.max_val = max_val

    @property
    def default(self):
        return self.min_val

    def validate(self, value):
        if not isinstance(value, (int, float)):
            raise TypeError(f"{self.name} must be numeric")
        if not (self.min_val <= value <= self.max_val):
            raise ValueError(
                f"{self.name} must be between {self.min_val} and {self.max_val}, got {value}"
            )


class Product:
    name = NonEmptyString()
    price = PositiveInt()
    rating = InRange(0.0, 5.0)

    def __init__(self, name: str, price: int, rating: float):
        self.name = name
        self.price = price
        self.rating = rating

    def __repr__(self):
        return f"Product({self.name!r}, ${self.price}, ★{self.rating})"

p = Product("Widget", 25, 4.5)
print(f"  {p}")

# Test validation
for test_name, func in [
    ("empty name", lambda: Product("", 10, 3.0)),
    ("negative price", lambda: Product("X", -5, 3.0)),
    ("rating out of range", lambda: Product("X", 10, 6.0)),
]:
    try:
        func()
    except (ValueError, TypeError) as e:
        print(f"  ✅ {test_name}: {e}")

# ===== DATA VS NON-DATA DESCRIPTORS =====
print("\n--- Data vs Non-Data Descriptors ---")

class NonDataDescriptor:
    """Only has __get__ — instance dict wins."""

    def __get__(self, obj, objtype=None):
        return "from descriptor"

class DataDescriptor:
    """Has __get__ and __set__ — descriptor wins."""

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get('_data_val', "from descriptor")

    def __set__(self, obj, value):
        obj.__dict__['_data_val'] = value

class Demo:
    non_data = NonDataDescriptor()
    data = DataDescriptor()

d = Demo()
print(f"  non_data: {d.non_data}")  # descriptor
d.__dict__['non_data'] = "from instance"
print(f"  non_data after dict set: {d.non_data}")  # instance wins!

print(f"  data: {d.data}")  # descriptor
d.data = "set via descriptor"
print(f"  data after set: {d.data}")  # still goes through descriptor

# ===== ORM-STYLE FIELD DESCRIPTOR =====
print("\n--- ORM-Style Fields ---")

class Field:
    """Descriptor that simulates an ORM field."""

    def __init__(self, field_type, primary_key=False, default=None):
        self.field_type = field_type
        self.primary_key = primary_key
        self.default = default

    def __set_name__(self, owner, name):
        self.name = name
        # Register field on the class
        if not hasattr(owner, '_fields'):
            owner._fields = {}
        owner._fields[name] = self

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.name, self.default)

    def __set__(self, obj, value):
        if value is not None and not isinstance(value, self.field_type):
            raise TypeError(
                f"{self.name}: expected {self.field_type.__name__}, "
                f"got {type(value).__name__}"
            )
        obj.__dict__[self.name] = value

class Model:
    """Base model with field introspection."""

    def __init__(self, **kwargs):
        for name, value in kwargs.items():
            setattr(self, name, value)

    def to_dict(self):
        return {name: getattr(self, name) for name in self._fields}

    def __repr__(self):
        fields = ", ".join(f"{k}={v!r}" for k, v in self.to_dict().items())
        return f"{self.__class__.__name__}({fields})"

class User(Model):
    id = Field(int, primary_key=True)
    name = Field(str)
    email = Field(str)
    age = Field(int, default=0)

user = User(id=1, name="Alice", email="alice@example.com", age=30)
print(f"  {user}")
print(f"  Fields: {list(User._fields.keys())}")
print(f"  Primary key: {[n for n, f in User._fields.items() if f.primary_key]}")
print(f"  As dict: {user.to_dict()}")

# Type validation
try:
    User(id="not_an_int", name="Bob", email="bob@test.com")
except TypeError as e:
    print(f"  ✅ Type error: {e}")

# ===== LAZY DESCRIPTOR =====
print("\n--- Lazy Descriptor ---")

class Lazy:
    """Computes value on first access, then caches it."""

    def __init__(self, func):
        self.func = func

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        # Compute and store in instance dict (replaces descriptor for this instance)
        value = self.func(obj)
        setattr(obj, self.name, value)
        return value

class ExpensiveObject:
    def __init__(self, n: int):
        self.n = n

    @Lazy
    def computed(self):
        print(f"  (Computing for n={self.n}...)")
        return sum(range(self.n))

obj = ExpensiveObject(1_000_000)
print(f"  First access: {obj.computed}")   # computes
print(f"  Second access: {obj.computed}")  # cached, no recompute
