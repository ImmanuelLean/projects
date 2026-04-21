"""
LESSON: Protocols & Abstract Base Classes
ABC, Protocol, runtime checking, structural vs nominal typing, collections.abc.

Run: python3 protocols_and_abcs.py
"""
from abc import ABC, abstractmethod
from typing import Protocol, runtime_checkable, Any
from collections.abc import (
    Iterable, Iterator, Sequence, MutableSequence,
    Mapping, MutableMapping, Callable, Hashable, Sized,
)

# ===== ABSTRACT BASE CLASS =====
print("--- Abstract Base Class ---")

class Shape(ABC):
    """Abstract base class — cannot be instantiated directly."""

    @abstractmethod
    def area(self) -> float:
        """Must be implemented by subclasses."""
        pass

    @abstractmethod
    def perimeter(self) -> float:
        pass

    # Concrete method available to all subclasses
    def description(self) -> str:
        return f"{type(self).__name__}: area={self.area():.2f}, perimeter={self.perimeter():.2f}"

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        import math
        return math.pi * self.radius ** 2

    def perimeter(self) -> float:
        import math
        return 2 * math.pi * self.radius

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)

# Can't instantiate ABC:
try:
    s = Shape()
except TypeError as e:
    print(f"  Can't instantiate ABC: {e}")

# Subclasses work:
shapes: list[Shape] = [Circle(5), Rectangle(4, 6)]
for shape in shapes:
    print(f"  {shape.description()}")

# ===== ABSTRACT PROPERTY =====
print("\n--- Abstract Property ---")

class Vehicle(ABC):
    @property
    @abstractmethod
    def fuel_type(self) -> str:
        pass

    @abstractmethod
    def start(self) -> str:
        pass

class ElectricCar(Vehicle):
    @property
    def fuel_type(self) -> str:
        return "Electric"

    def start(self) -> str:
        return "Silently starting..."

class GasCar(Vehicle):
    @property
    def fuel_type(self) -> str:
        return "Gasoline"

    def start(self) -> str:
        return "Vroom! Engine started"

for car in [ElectricCar(), GasCar()]:
    print(f"  {type(car).__name__}: {car.fuel_type}, {car.start()}")

# ===== PROTOCOL (Structural Typing) =====
print("\n--- Protocol (Structural Typing) ---")

# Protocol = if it walks like a duck and quacks like a duck...
# No inheritance needed! Just implement the required methods.

@runtime_checkable
class Renderable(Protocol):
    def render(self) -> str: ...

@runtime_checkable
class Saveable(Protocol):
    def save(self, path: str) -> bool: ...

# This class satisfies Renderable WITHOUT inheriting from it
class HTMLComponent:
    def __init__(self, tag: str, content: str):
        self.tag = tag
        self.content = content

    def render(self) -> str:
        return f"<{self.tag}>{self.content}</{self.tag}>"

class MarkdownText:
    def __init__(self, text: str):
        self.text = text

    def render(self) -> str:
        return f"**{self.text}**"

def render_all(items: list[Renderable]) -> list[str]:
    """Accepts any object with a render() method."""
    return [item.render() for item in items]

items = [HTMLComponent("h1", "Hello"), MarkdownText("World")]
results = render_all(items)
for r in results:
    print(f"  {r}")

# Runtime checking
print(f"  HTMLComponent is Renderable: {isinstance(HTMLComponent('p', ''), Renderable)}")
print(f"  str is Renderable: {isinstance('hello', Renderable)}")

# ===== ABC VS PROTOCOL =====
print("\n--- ABC vs Protocol ---")

print("""  ABC (Nominal Typing):
    - Requires explicit inheritance
    - Can have concrete methods
    - Enforced at class creation
    - Use when you control the hierarchy

  Protocol (Structural Typing):
    - No inheritance needed
    - Based on method signatures
    - More flexible (duck typing)
    - Use for interfaces you don't control
    - Better for third-party code""")

# ===== COLLECTIONS.ABC =====
print("\n--- collections.abc ---")

# Register custom classes with built-in ABCs

class FixedArray:
    """Custom sequence-like class."""

    def __init__(self, *items):
        self._data = list(items)

    def __getitem__(self, index):
        return self._data[index]

    def __len__(self):
        return len(self._data)

    def __contains__(self, item):
        return item in self._data

    def __iter__(self):
        return iter(self._data)

arr = FixedArray(10, 20, 30, 40)

# Check against collections.abc
print(f"  Is Iterable: {isinstance(arr, Iterable)}")
print(f"  Is Sized: {isinstance(arr, Sized)}")
print(f"  Is Sequence: {isinstance(arr, Sequence)}")

print(f"  len: {len(arr)}")
print(f"  30 in arr: {30 in arr}")
print(f"  list: {list(arr)}")

# ===== VIRTUAL SUBCLASS REGISTRATION =====
print("\n--- Virtual Subclass Registration ---")

class Printable(ABC):
    @abstractmethod
    def to_string(self) -> str: ...

# Register an existing class as a virtual subclass
@Printable.register
class SimpleText:
    def __init__(self, text: str):
        self.text = text

    def to_string(self) -> str:
        return self.text

st = SimpleText("Hello")
print(f"  isinstance check: {isinstance(st, Printable)}")  # True!
print(f"  issubclass check: {issubclass(SimpleText, Printable)}")

# ===== MULTIPLE PROTOCOLS =====
print("\n--- Multiple Protocols ---")

class Identifiable(Protocol):
    @property
    def id(self) -> int: ...

class Nameable(Protocol):
    @property
    def name(self) -> str: ...

class Entity(Identifiable, Nameable, Protocol):
    """Combined protocol."""
    pass

class Employee:
    def __init__(self, id: int, name: str, role: str):
        self._id = id
        self._name = name
        self.role = role

    @property
    def id(self) -> int:
        return self._id

    @property
    def name(self) -> str:
        return self._name

def print_entity(entity: Entity):
    print(f"  Entity #{entity.id}: {entity.name}")

print_entity(Employee(1, "Alice", "Developer"))

# ===== PRACTICAL: REPOSITORY PATTERN =====
print("\n--- Repository Pattern ---")

class Repository(Protocol[Any]):
    """Generic repository interface."""

    def get(self, id: int) -> Any | None: ...
    def get_all(self) -> list[Any]: ...
    def add(self, item: Any) -> Any: ...
    def delete(self, id: int) -> bool: ...

class InMemoryRepository:
    """In-memory implementation."""

    def __init__(self):
        self._store: dict[int, Any] = {}
        self._next_id = 1

    def get(self, id: int) -> Any | None:
        return self._store.get(id)

    def get_all(self) -> list[Any]:
        return list(self._store.values())

    def add(self, item: dict) -> dict:
        item["id"] = self._next_id
        self._store[self._next_id] = item
        self._next_id += 1
        return item

    def delete(self, id: int) -> bool:
        return self._store.pop(id, None) is not None

# Usage
repo = InMemoryRepository()
repo.add({"name": "Alice"})
repo.add({"name": "Bob"})
print(f"  All: {repo.get_all()}")
print(f"  Get 1: {repo.get(1)}")
repo.delete(1)
print(f"  After delete: {repo.get_all()}")
