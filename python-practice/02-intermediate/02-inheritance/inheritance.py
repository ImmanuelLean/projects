"""
LESSON: Inheritance
Single, multi-level, super(), MRO, isinstance/issubclass.

Run: python3 inheritance.py
"""

# ===== BASIC INHERITANCE =====
print("--- Basic Inheritance ---")

class Animal:
    def __init__(self, name: str, sound: str):
        self.name = name
        self.sound = sound

    def speak(self) -> str:
        return f"{self.name} says {self.sound}!"

    def info(self) -> str:
        return f"{type(self).__name__}: {self.name}"

class Dog(Animal):
    def __init__(self, name: str, breed: str):
        super().__init__(name, "Woof")
        self.breed = breed

    def fetch(self) -> str:
        return f"{self.name} fetches the ball!"

class Cat(Animal):
    def __init__(self, name: str, indoor: bool = True):
        super().__init__(name, "Meow")
        self.indoor = indoor

    def purr(self) -> str:
        return f"{self.name} purrs..."

dog = Dog("Rex", "German Shepherd")
cat = Cat("Whiskers")

print(dog.speak())      # inherited
print(dog.fetch())      # own method
print(cat.speak())
print(cat.purr())

# ===== METHOD OVERRIDING =====
print("\n--- Method Overriding ---")

class Shape:
    def area(self) -> float:
        return 0.0

    def describe(self) -> str:
        return f"{type(self).__name__} with area {self.area():.2f}"

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        import math
        return math.pi * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

shapes = [Circle(5), Rectangle(4, 6), Circle(3)]
for s in shapes:
    print(f"  {s.describe()}")

# ===== SUPER() =====
print("\n--- super() ---")

class Base:
    def __init__(self, x: int):
        self.x = x
        print(f"  Base.__init__(x={x})")

    def method(self):
        print(f"  Base.method()")

class Child(Base):
    def __init__(self, x: int, y: int):
        super().__init__(x)  # call parent __init__
        self.y = y
        print(f"  Child.__init__(y={y})")

    def method(self):
        super().method()  # call parent method
        print(f"  Child.method()")

c = Child(10, 20)
c.method()

# ===== MULTI-LEVEL INHERITANCE =====
print("\n--- Multi-Level Inheritance ---")

class Vehicle:
    def __init__(self, make: str, year: int):
        self.make = make
        self.year = year

    def start(self) -> str:
        return "Vehicle starting..."

class Car(Vehicle):
    def __init__(self, make: str, year: int, doors: int):
        super().__init__(make, year)
        self.doors = doors

    def start(self) -> str:
        return f"{self.make} car starting... vroom!"

class ElectricCar(Car):
    def __init__(self, make: str, year: int, doors: int, battery_kwh: int):
        super().__init__(make, year, doors)
        self.battery_kwh = battery_kwh

    def start(self) -> str:
        return f"{self.make} EV starting silently... ({self.battery_kwh}kWh)"

ev = ElectricCar("Tesla", 2024, 4, 100)
print(f"  {ev.start()}")
print(f"  make={ev.make}, year={ev.year}, doors={ev.doors}, battery={ev.battery_kwh}kWh")

# ===== ISINSTANCE / ISSUBCLASS =====
print("\n--- isinstance / issubclass ---")

print(f"isinstance(ev, ElectricCar): {isinstance(ev, ElectricCar)}")
print(f"isinstance(ev, Car): {isinstance(ev, Car)}")
print(f"isinstance(ev, Vehicle): {isinstance(ev, Vehicle)}")
print(f"isinstance(ev, object): {isinstance(ev, object)}")

print(f"\nissubclass(ElectricCar, Car): {issubclass(ElectricCar, Car)}")
print(f"issubclass(ElectricCar, Vehicle): {issubclass(ElectricCar, Vehicle)}")
print(f"issubclass(Car, ElectricCar): {issubclass(Car, ElectricCar)}")

# ===== MRO (Method Resolution Order) =====
print("\n--- MRO ---")
print(f"ElectricCar MRO: {[c.__name__ for c in ElectricCar.__mro__]}")

# ===== POLYMORPHISM =====
print("\n--- Polymorphism ---")

def describe_vehicle(v: Vehicle) -> None:
    print(f"  {type(v).__name__}: {v.start()}")

vehicles = [
    Vehicle("Generic", 2020),
    Car("Toyota", 2023, 4),
    ElectricCar("Tesla", 2024, 4, 100),
]

for v in vehicles:
    describe_vehicle(v)
