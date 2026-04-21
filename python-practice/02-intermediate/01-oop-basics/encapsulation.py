"""
LESSON: Encapsulation
Private/protected conventions, @property, getters/setters, __slots__.

Run: python3 encapsulation.py
"""

# ===== ACCESS CONVENTIONS =====
print("--- Access Conventions ---")

class Employee:
    def __init__(self, name: str, salary: float):
        self.name = name          # public
        self._department = "Engineering"  # protected (convention)
        self.__salary = salary    # private (name mangled)

    def get_info(self):
        return f"{self.name}, {self._department}, ${self.__salary:,.2f}"

emp = Employee("Alice", 95000)
print(f"Public:    emp.name = {emp.name}")
print(f"Protected: emp._department = {emp._department}")  # accessible but "don't touch"

# Private uses name mangling: __salary -> _Employee__salary
print(f"Mangled:   emp._Employee__salary = {emp._Employee__salary}")
# print(emp.__salary)  # AttributeError!

print(f"Info: {emp.get_info()}")

# ===== @PROPERTY (Pythonic getters/setters) =====
print("\n--- @property ---")

class Temperature:
    def __init__(self, celsius: float = 0):
        self._celsius = celsius

    @property
    def celsius(self) -> float:
        """Get temperature in Celsius."""
        return self._celsius

    @celsius.setter
    def celsius(self, value: float) -> None:
        """Set temperature with validation."""
        if value < -273.15:
            raise ValueError("Temperature below absolute zero!")
        self._celsius = value

    @property
    def fahrenheit(self) -> float:
        """Get temperature in Fahrenheit (computed)."""
        return self._celsius * 9/5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value: float) -> None:
        """Set via Fahrenheit."""
        self.celsius = (value - 32) * 5/9

    def __str__(self):
        return f"{self._celsius:.1f}°C ({self.fahrenheit:.1f}°F)"

temp = Temperature(100)
print(f"Boiling: {temp}")

temp.celsius = 37
print(f"Body temp: {temp}")

temp.fahrenheit = 32
print(f"Freezing: {temp}")

try:
    temp.celsius = -300
except ValueError as e:
    print(f"Error: {e}")

# ===== PROPERTY FOR COMPUTED VALUES =====
print("\n--- Computed Properties ---")

class Rectangle:
    def __init__(self, width: float, height: float):
        self._width = width
        self._height = height

    @property
    def width(self) -> float:
        return self._width

    @width.setter
    def width(self, value: float) -> None:
        if value <= 0:
            raise ValueError("Width must be positive")
        self._width = value

    @property
    def height(self) -> float:
        return self._height

    @height.setter
    def height(self, value: float) -> None:
        if value <= 0:
            raise ValueError("Height must be positive")
        self._height = value

    @property
    def area(self) -> float:
        return self._width * self._height

    @property
    def perimeter(self) -> float:
        return 2 * (self._width + self._height)

    def __str__(self):
        return f"Rectangle({self._width}x{self._height})"

r = Rectangle(10, 5)
print(f"{r}")
print(f"Area: {r.area}")
print(f"Perimeter: {r.perimeter}")

r.width = 20
print(f"After resize: area = {r.area}")

# ===== __SLOTS__ =====
print("\n--- __slots__ ---")
print("Restricts attributes and saves memory")

class Point:
    __slots__ = ('x', 'y')

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Point({self.x}, {self.y})"

p = Point(3, 4)
print(f"{p}")
print(f"p.x = {p.x}")

try:
    p.z = 10  # Can't add new attributes!
except AttributeError as e:
    print(f"Can't add attribute: {e}")

# Memory comparison
import sys

class WithSlots:
    __slots__ = ('x', 'y', 'z')
    def __init__(self):
        self.x = self.y = self.z = 0

class WithoutSlots:
    def __init__(self):
        self.x = self.y = self.z = 0

ws = WithSlots()
wo = WithoutSlots()
print(f"\nWithout __slots__: {sys.getsizeof(wo.__dict__)} bytes for __dict__")
print(f"With __slots__: no __dict__ (saves memory)")
print(f"hasattr __dict__: slots={hasattr(ws, '__dict__')}, normal={hasattr(wo, '__dict__')}")

# ===== READ-ONLY PROPERTY =====
print("\n--- Read-Only Property ---")

class Circle:
    def __init__(self, radius: float):
        self._radius = radius

    @property
    def radius(self) -> float:
        return self._radius

    @property
    def area(self) -> float:
        import math
        return math.pi * self._radius ** 2

    # No setter = read-only
    # circle.area = 100  # AttributeError!

c = Circle(5)
print(f"Circle radius={c.radius}, area={c.area:.2f}")

try:
    c.area = 100
except AttributeError as e:
    print(f"Read-only: {e}")
