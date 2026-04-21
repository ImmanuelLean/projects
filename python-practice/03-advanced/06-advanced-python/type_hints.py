"""
LESSON: Advanced Type Hints
Generics, TypeVar, Protocol, Literal, TypeGuard, overload, dataclass patterns.

Run: python3 type_hints.py
"""
from typing import (
    TypeVar, Generic, Protocol, Literal, TypeGuard,
    overload, ClassVar, Final, TypeAlias, Self,
    Any, Union, Optional, Callable, Iterator, Sequence,
    NamedTuple, TypedDict, runtime_checkable,
)
from dataclasses import dataclass, field
from abc import abstractmethod

# ===== BASIC TYPE HINTS =====
print("--- Basic Type Hints ---")

def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()

# Collections
def process_items(
    items: list[int],
    lookup: dict[str, int],
    unique: set[str],
    pair: tuple[int, str],
) -> list[str]:
    return [str(x) for x in items]

# Optional and Union
def find_user(user_id: int) -> str | None:
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)

print(f"  {greet('World', 2)}")
print(f"  find_user(1): {find_user(1)}")
print(f"  find_user(9): {find_user(9)}")

# ===== TYPEVAR & GENERICS =====
print("\n--- TypeVar & Generics ---")

T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")

def first(items: list[T]) -> T:
    """Generic function: returns same type as list elements."""
    return items[0]

# Bounded TypeVar
Numeric = TypeVar("Numeric", int, float)

def add_numbers(a: Numeric, b: Numeric) -> Numeric:
    return a + b

print(f"  first([1, 2, 3]): {first([1, 2, 3])}")
print(f"  first(['a', 'b']): {first(['a', 'b'])}")
print(f"  add_numbers(1, 2): {add_numbers(1, 2)}")

# ===== GENERIC CLASSES =====
print("\n--- Generic Classes ---")

class Stack(Generic[T]):
    """Type-safe stack."""

    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

    def peek(self) -> T:
        return self._items[-1]

    def __len__(self) -> int:
        return len(self._items)

    def __repr__(self) -> str:
        return f"Stack({self._items})"

# Usage with specific types
int_stack: Stack[int] = Stack()
int_stack.push(1)
int_stack.push(2)
print(f"  Int stack: {int_stack}")

str_stack: Stack[str] = Stack()
str_stack.push("hello")
str_stack.push("world")
print(f"  Str stack: {str_stack}")

# Generic with multiple type params
class Pair(Generic[K, V]):
    def __init__(self, key: K, value: V) -> None:
        self.key = key
        self.value = value

    def __repr__(self) -> str:
        return f"Pair({self.key!r}, {self.value!r})"

p: Pair[str, int] = Pair("age", 30)
print(f"  {p}")

# ===== PROTOCOL (Structural Typing) =====
print("\n--- Protocol ---")

@runtime_checkable
class Drawable(Protocol):
    """Any class with a draw() method satisfies this protocol."""

    def draw(self) -> str: ...

class Circle:
    def __init__(self, radius: float):
        self.radius = radius

    def draw(self) -> str:
        return f"○ Circle(r={self.radius})"

class Square:
    def __init__(self, side: float):
        self.side = side

    def draw(self) -> str:
        return f"□ Square(s={self.side})"

def render(shape: Drawable) -> None:
    print(f"  Drawing: {shape.draw()}")

render(Circle(5))
render(Square(3))

# Runtime check
print(f"  Circle is Drawable: {isinstance(Circle(1), Drawable)}")

# ===== CALLABLE TYPES =====
print("\n--- Callable Types ---")

# Function that takes a callback
def apply_operation(
    values: list[int],
    operation: Callable[[int], int],
) -> list[int]:
    return [operation(v) for v in values]

result = apply_operation([1, 2, 3, 4], lambda x: x ** 2)
print(f"  Squared: {result}")

# Callable with specific signature
Transformer: TypeAlias = Callable[[str], str]

def pipeline(text: str, *transforms: Transformer) -> str:
    for t in transforms:
        text = t(text)
    return text

result = pipeline("  Hello World  ", str.strip, str.lower, str.title)
print(f"  Pipeline: '{result}'")

# ===== LITERAL =====
print("\n--- Literal ---")

def set_color(color: Literal["red", "green", "blue"]) -> str:
    return f"Color set to {color}"

print(f"  {set_color('red')}")

# ===== TYPEDDICT =====
print("\n--- TypedDict ---")

class UserDict(TypedDict):
    name: str
    age: int
    email: str

class PartialUser(TypedDict, total=False):
    name: str
    age: int

def create_user(data: UserDict) -> str:
    return f"User: {data['name']}, {data['age']}"

user: UserDict = {"name": "Alice", "age": 30, "email": "alice@test.com"}
print(f"  {create_user(user)}")

# ===== NAMEDTUPLE WITH TYPES =====
print("\n--- Typed NamedTuple ---")

class Point(NamedTuple):
    x: float
    y: float
    label: str = "origin"

p = Point(3.0, 4.0, "A")
print(f"  {p}")
print(f"  Distance: {(p.x**2 + p.y**2)**0.5:.2f}")

# ===== DATACLASS PATTERNS =====
print("\n--- Dataclass Patterns ---")

@dataclass
class Config:
    host: str
    port: int = 8080
    debug: bool = False
    tags: list[str] = field(default_factory=list)

    # ClassVar: shared by all instances, not in __init__
    version: ClassVar[str] = "1.0.0"

    # Final: cannot be reassigned (type checker enforced)
    MAX_RETRIES: Final[int] = 3

    def url(self) -> str:
        return f"http://{self.host}:{self.port}"

config = Config("localhost", debug=True, tags=["dev"])
print(f"  {config}")
print(f"  URL: {config.url()}")
print(f"  Version: {Config.version}")

# Frozen dataclass (immutable)
@dataclass(frozen=True)
class Coordinate:
    lat: float
    lon: float

coord = Coordinate(40.7128, -74.0060)
print(f"  Coordinate: {coord}")
try:
    coord.lat = 0  # type: ignore
except AttributeError as e:
    print(f"  Frozen: {e}")

# ===== OVERLOAD =====
print("\n--- @overload ---")

@overload
def process(data: str) -> list[str]: ...
@overload
def process(data: list[int]) -> int: ...
@overload
def process(data: dict[str, Any]) -> list[str]: ...

def process(data):
    """Different return type based on input type."""
    if isinstance(data, str):
        return data.split()
    elif isinstance(data, list):
        return sum(data)
    elif isinstance(data, dict):
        return list(data.keys())

print(f"  process('hello world'): {process('hello world')}")
print(f"  process([1, 2, 3]): {process([1, 2, 3])}")
print(f"  process({{'a': 1}}): {process({'a': 1})}")

# ===== TYPE ALIAS =====
print("\n--- Type Aliases ---")

# Modern syntax (Python 3.12+) would use: type Vector = list[float]
Vector: TypeAlias = list[float]
Matrix: TypeAlias = list[Vector]
JSON: TypeAlias = dict[str, Any]

def dot_product(a: Vector, b: Vector) -> float:
    return sum(x * y for x, y in zip(a, b))

result = dot_product([1.0, 2.0, 3.0], [4.0, 5.0, 6.0])
print(f"  Dot product: {result}")

# ===== SELF TYPE =====
print("\n--- Self Type ---")

class Builder:
    def __init__(self) -> None:
        self.name = ""
        self.value = 0

    def set_name(self, name: str) -> Self:
        self.name = name
        return self

    def set_value(self, value: int) -> Self:
        self.value = value
        return self

    def __repr__(self) -> str:
        return f"Builder(name={self.name!r}, value={self.value})"

b = Builder().set_name("test").set_value(42)
print(f"  {b}")
