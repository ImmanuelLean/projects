"""
LESSON: Abstract Classes and Protocols
ABC, abstractmethod, interfaces, Protocol (typing).

Run: python3 abstract_classes.py
"""
from abc import ABC, abstractmethod
from typing import Protocol, runtime_checkable

# ===== ABSTRACT BASE CLASS =====
print("--- Abstract Base Class ---")

class Shape(ABC):
    """Abstract base class — cannot be instantiated directly."""

    @abstractmethod
    def area(self) -> float:
        """Calculate area. Must be implemented by subclass."""
        pass

    @abstractmethod
    def perimeter(self) -> float:
        """Calculate perimeter. Must be implemented by subclass."""
        pass

    # Concrete method (inherited as-is)
    def describe(self) -> str:
        return f"{type(self).__name__}: area={self.area():.2f}, perimeter={self.perimeter():.2f}"

# Can't instantiate abstract class
try:
    s = Shape()
except TypeError as e:
    print(f"Can't instantiate ABC: {e}")

# Must implement ALL abstract methods
import math

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        return math.pi * self.radius ** 2

    def perimeter(self) -> float:
        return 2 * math.pi * self.radius

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)

class Triangle(Shape):
    def __init__(self, a: float, b: float, c: float):
        self.a, self.b, self.c = a, b, c

    def area(self) -> float:
        s = (self.a + self.b + self.c) / 2
        return math.sqrt(s * (s - self.a) * (s - self.b) * (s - self.c))

    def perimeter(self) -> float:
        return self.a + self.b + self.c

shapes: list[Shape] = [Circle(5), Rectangle(4, 6), Triangle(3, 4, 5)]
for s in shapes:
    print(f"  {s.describe()}")

# ===== ABSTRACT PROPERTIES =====
print("\n--- Abstract Properties ---")

class Database(ABC):
    @property
    @abstractmethod
    def connection_string(self) -> str:
        pass

    @abstractmethod
    def connect(self) -> str:
        pass

    @abstractmethod
    def query(self, sql: str) -> str:
        pass

class PostgresDB(Database):
    def __init__(self, host: str, db: str):
        self._host = host
        self._db = db

    @property
    def connection_string(self) -> str:
        return f"postgresql://{self._host}/{self._db}"

    def connect(self) -> str:
        return f"Connected to {self.connection_string}"

    def query(self, sql: str) -> str:
        return f"Executing on Postgres: {sql}"

db = PostgresDB("localhost", "myapp")
print(f"  {db.connect()}")
print(f"  {db.query('SELECT * FROM users')}")

# ===== PROTOCOL (Structural Subtyping / Duck Typing) =====
print("\n--- Protocol (Structural Subtyping) ---")

@runtime_checkable
class Drawable(Protocol):
    """Any class with draw() and name attribute satisfies this."""
    name: str

    def draw(self) -> str:
        ...

# These classes don't inherit from Drawable — they just match the interface!
class Button:
    def __init__(self, label: str):
        self.name = label

    def draw(self) -> str:
        return f"[{self.name}]"

class Icon:
    def __init__(self, symbol: str):
        self.name = symbol

    def draw(self) -> str:
        return f"({self.name})"

class TextLabel:
    def __init__(self, text: str):
        self.name = text

    def draw(self) -> str:
        return self.name

def render(widgets: list[Drawable]) -> None:
    for w in widgets:
        print(f"  Rendering: {w.draw()}")

widgets = [Button("OK"), Icon("★"), TextLabel("Hello")]
render(widgets)

# runtime_checkable allows isinstance()
print(f"\nButton is Drawable: {isinstance(Button('x'), Drawable)}")
print(f"int is Drawable: {isinstance(42, Drawable)}")

# ===== ABC vs PROTOCOL =====
print("\n--- ABC vs Protocol ---")
print("ABC (Abstract Base Class):")
print("  - Nominal typing (must explicitly inherit)")
print("  - Enforced at instantiation time")
print("  - Use when you control the class hierarchy")
print()
print("Protocol:")
print("  - Structural typing (duck typing)")
print("  - No inheritance needed")
print("  - Use when you want flexibility / 3rd party compat")

# ===== REGISTERING VIRTUAL SUBCLASSES =====
print("\n--- Virtual Subclasses ---")

class Closable(ABC):
    @abstractmethod
    def close(self) -> None:
        pass

# Register an existing class as a "virtual subclass"
@Closable.register
class FileHandle:
    def close(self) -> None:
        print("  FileHandle closed")

fh = FileHandle()
print(f"isinstance(FileHandle(), Closable): {isinstance(fh, Closable)}")
fh.close()
