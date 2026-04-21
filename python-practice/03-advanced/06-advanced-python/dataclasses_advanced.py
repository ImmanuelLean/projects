"""
LESSON: Advanced Dataclasses & Data Modeling
dataclass features, __post_init__, slots, match_args, attrs comparison.

Run: python3 dataclasses_advanced.py
"""
from dataclasses import dataclass, field, asdict, astuple, replace, fields
from typing import ClassVar
import json

# ===== BASIC DATACLASS =====
print("--- Basic Dataclass ---")

@dataclass
class User:
    name: str
    email: str
    age: int
    active: bool = True

user = User("Alice", "alice@example.com", 30)
print(f"  {user}")
print(f"  repr: {repr(user)}")
print(f"  eq: {user == User('Alice', 'alice@example.com', 30)}")

# ===== MUTABLE DEFAULTS =====
print("\n--- Mutable Defaults with field() ---")

@dataclass
class Team:
    name: str
    members: list[str] = field(default_factory=list)
    scores: dict[str, int] = field(default_factory=dict)
    _internal: str = field(default="private", repr=False)

t1 = Team("Alpha")
t1.members.append("Alice")

t2 = Team("Beta")
t2.members.append("Bob")

print(f"  t1: {t1}")
print(f"  t2: {t2}")  # separate lists!

# ===== __post_init__ =====
print("\n--- __post_init__ ---")

@dataclass
class Temperature:
    celsius: float
    fahrenheit: float = field(init=False)
    kelvin: float = field(init=False)

    def __post_init__(self):
        self.fahrenheit = self.celsius * 9/5 + 32
        self.kelvin = self.celsius + 273.15

temp = Temperature(100)
print(f"  {temp}")

# Validation in __post_init__
@dataclass
class Product:
    name: str
    price: float
    quantity: int = 0

    def __post_init__(self):
        if self.price < 0:
            raise ValueError(f"Price cannot be negative: {self.price}")
        if not self.name.strip():
            raise ValueError("Name cannot be empty")
        self.name = self.name.strip().title()

p = Product("  widget  ", 9.99, 5)
print(f"  Product: {p}")

try:
    Product("Bad", -5.0)
except ValueError as e:
    print(f"  Validation: {e}")

# ===== FROZEN (IMMUTABLE) =====
print("\n--- Frozen Dataclass ---")

@dataclass(frozen=True)
class Point:
    x: float
    y: float

    def distance_to(self, other: "Point") -> float:
        return ((self.x - other.x)**2 + (self.y - other.y)**2)**0.5

    def translate(self, dx: float, dy: float) -> "Point":
        """Returns a NEW point (can't modify frozen)."""
        return Point(self.x + dx, self.y + dy)

p1 = Point(3, 4)
p2 = p1.translate(1, 1)
print(f"  p1: {p1}, p2: {p2}")
print(f"  Distance: {p1.distance_to(p2):.2f}")
print(f"  Hash: {hash(p1)}")  # frozen → hashable

# Can use in sets and dict keys
points = {Point(0, 0), Point(1, 1), Point(0, 0)}
print(f"  Unique points: {points}")

# ===== ORDERING =====
print("\n--- Ordering (order=True) ---")

@dataclass(order=True)
class Student:
    gpa: float
    name: str = field(compare=False)  # not used in comparison
    id: int = field(compare=False)

students = [
    Student(3.5, "Alice", 1),
    Student(3.8, "Bob", 2),
    Student(3.2, "Charlie", 3),
    Student(3.8, "Diana", 4),
]

for s in sorted(students, reverse=True):
    print(f"  GPA {s.gpa}: {s.name}")

# ===== SLOTS =====
print("\n--- Slots (Python 3.10+) ---")

@dataclass(slots=True)
class Efficient:
    x: int
    y: int
    z: int

import sys
regular = User("A", "a@b.com", 1)
slotted = Efficient(1, 2, 3)
print(f"  Regular size: {sys.getsizeof(regular)} bytes")
print(f"  Slotted size: {sys.getsizeof(slotted)} bytes")

# ===== CONVERSION UTILITIES =====
print("\n--- Conversion: asdict, astuple, replace ---")

@dataclass
class Address:
    street: str
    city: str
    state: str

@dataclass
class Person:
    name: str
    age: int
    address: Address

person = Person("Alice", 30, Address("123 Main St", "NYC", "NY"))

# Convert to dict (recursive)
d = asdict(person)
print(f"  asdict: {d}")

# Convert to JSON
print(f"  JSON: {json.dumps(d)}")

# Convert to tuple
t = astuple(person)
print(f"  astuple: {t}")

# Replace (create modified copy)
person2 = replace(person, name="Bob", age=25)
print(f"  replace: {person2}")

# ===== FIELD METADATA =====
print("\n--- Field Metadata ---")

@dataclass
class Schema:
    name: str = field(metadata={"max_length": 100, "required": True})
    age: int = field(metadata={"min": 0, "max": 150})
    email: str = field(metadata={"pattern": r".*@.*\..*"})

# Inspect metadata
for f in fields(Schema):
    print(f"  {f.name}: type={f.type}, metadata={f.metadata}")

# ===== INHERITANCE =====
print("\n--- Dataclass Inheritance ---")

@dataclass
class Animal:
    name: str
    species: str

@dataclass
class Pet(Animal):
    owner: str
    vaccinated: bool = False

pet = Pet("Buddy", "Dog", "Alice", True)
print(f"  {pet}")
print(f"  Is Animal: {isinstance(pet, Animal)}")

# ===== KW_ONLY =====
print("\n--- kw_only (Python 3.10+) ---")

@dataclass(kw_only=True)
class Config:
    host: str
    port: int = 8080
    debug: bool = False
    workers: int = 4

# Must use keyword arguments
config = Config(host="localhost", debug=True)
print(f"  {config}")

# ===== MATCH_ARGS =====
print("\n--- match_args (Python 3.10+) ---")

@dataclass
class Shape:
    kind: str
    size: float

shape = Shape("circle", 5.0)

match shape:
    case Shape(kind="circle", size=s):
        print(f"  Circle with size {s}")
    case Shape(kind="square", size=s):
        print(f"  Square with size {s}")
    case _:
        print(f"  Unknown shape")

# ===== PRACTICAL: SERIALIZABLE MODEL =====
print("\n--- Practical: Serializable Model ---")

@dataclass
class Model:
    """Base model with serialization support."""

    def to_dict(self) -> dict:
        return asdict(self)

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent, default=str)

    @classmethod
    def from_dict(cls, data: dict):
        # Get only fields that exist in the class
        valid_fields = {f.name for f in fields(cls)}
        filtered = {k: v for k, v in data.items() if k in valid_fields}
        return cls(**filtered)

@dataclass
class Order(Model):
    id: int
    product: str
    quantity: int
    price: float
    total: float = field(init=False)

    def __post_init__(self):
        self.total = self.quantity * self.price

order = Order(1, "Widget", 5, 9.99)
print(f"  Order: {order}")
print(f"  JSON: {order.to_json()}")

# Round-trip
data = order.to_dict()
order2 = Order.from_dict(data)
print(f"  From dict: {order2}")
print(f"  Equal: {order == order2}")
