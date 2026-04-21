"""
LESSON: Multiple Inheritance
Multiple inheritance, mixins, MRO with diamond, cooperative super().

Run: python3 multiple_inheritance.py
"""

# ===== BASIC MULTIPLE INHERITANCE =====
print("--- Multiple Inheritance ---")

class Flyable:
    def fly(self) -> str:
        return f"{type(self).__name__} is flying!"

class Swimmable:
    def swim(self) -> str:
        return f"{type(self).__name__} is swimming!"

class Walkable:
    def walk(self) -> str:
        return f"{type(self).__name__} is walking!"

class Duck(Flyable, Swimmable, Walkable):
    def __init__(self, name: str):
        self.name = name

    def quack(self) -> str:
        return f"{self.name} says: Quack!"

duck = Duck("Donald")
print(duck.quack())
print(duck.fly())
print(duck.swim())
print(duck.walk())

# ===== MIXINS =====
print("\n--- Mixins ---")

class JsonMixin:
    """Mixin that adds JSON serialization."""
    def to_json(self) -> str:
        import json
        return json.dumps(vars(self), indent=2)

class LogMixin:
    """Mixin that adds logging capability."""
    def log(self, message: str) -> None:
        print(f"  [{type(self).__name__}] {message}")

class TimestampMixin:
    """Mixin that adds creation timestamp."""
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)

    def get_timestamp(self) -> str:
        from datetime import datetime
        return datetime.now().isoformat()

class User(JsonMixin, LogMixin):
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

user = User("Emmanuel", "emmanuel@example.com")
user.log("User created")
print(f"JSON:\n{user.to_json()}")

# ===== DIAMOND PROBLEM =====
print("\n--- Diamond Problem ---")

class A:
    def __init__(self):
        print("  A.__init__")
        super().__init__()

    def greet(self):
        return "Hello from A"

class B(A):
    def __init__(self):
        print("  B.__init__")
        super().__init__()

    def greet(self):
        return "Hello from B"

class C(A):
    def __init__(self):
        print("  C.__init__")
        super().__init__()

    def greet(self):
        return "Hello from C"

class D(B, C):
    def __init__(self):
        print("  D.__init__")
        super().__init__()

print("Creating D():")
d = D()
print(f"\nd.greet(): {d.greet()}")
print(f"MRO: {[cls.__name__ for cls in D.__mro__]}")
print("(D -> B -> C -> A -> object)")

# ===== COOPERATIVE SUPER() =====
print("\n--- Cooperative super() ---")

class Base:
    def __init__(self, **kwargs):
        print(f"  Base.__init__(kwargs={kwargs})")

class Left(Base):
    def __init__(self, left_val, **kwargs):
        self.left_val = left_val
        print(f"  Left.__init__(left_val={left_val})")
        super().__init__(**kwargs)

class Right(Base):
    def __init__(self, right_val, **kwargs):
        self.right_val = right_val
        print(f"  Right.__init__(right_val={right_val})")
        super().__init__(**kwargs)

class Bottom(Left, Right):
    def __init__(self, bottom_val, **kwargs):
        self.bottom_val = bottom_val
        print(f"  Bottom.__init__(bottom_val={bottom_val})")
        super().__init__(**kwargs)

print("Creating Bottom with cooperative super():")
b = Bottom(bottom_val=1, left_val=2, right_val=3)
print(f"Values: bottom={b.bottom_val}, left={b.left_val}, right={b.right_val}")
print(f"MRO: {[c.__name__ for c in Bottom.__mro__]}")

# ===== PRACTICAL: COMPOSING BEHAVIORS =====
print("\n--- Practical: Composing Behaviors ---")

class Serializable:
    def serialize(self) -> dict:
        return {k: v for k, v in vars(self).items() if not k.startswith('_')}

class Validatable:
    def validate(self) -> list[str]:
        errors = []
        for key, value in vars(self).items():
            if key.startswith('_'):
                continue
            if value is None:
                errors.append(f"{key} is required")
            if isinstance(value, str) and not value.strip():
                errors.append(f"{key} cannot be empty")
        return errors

class Product(Serializable, Validatable):
    def __init__(self, name: str, price: float, category: str = None):
        self.name = name
        self.price = price
        self.category = category

p1 = Product("Laptop", 999.99, "Electronics")
print(f"Serialized: {p1.serialize()}")
print(f"Errors: {p1.validate()}")

p2 = Product("", 0, None)
print(f"\nInvalid product errors: {p2.validate()}")
