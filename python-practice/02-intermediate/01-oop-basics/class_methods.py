"""
LESSON: Class Methods and Static Methods
@classmethod, @staticmethod, factory methods, alternative constructors.

Run: python3 class_methods.py
"""
import json
from datetime import date

# ===== @CLASSMETHOD =====
print("--- @classmethod ---")

class Person:
    count = 0

    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age
        Person.count += 1

    # Class method: receives cls (the class), not self
    @classmethod
    def from_birth_year(cls, name: str, birth_year: int):
        """Alternative constructor: create from birth year."""
        age = date.today().year - birth_year
        return cls(name, age)  # cls() works with subclasses too!

    @classmethod
    def from_dict(cls, data: dict):
        """Create from dictionary."""
        return cls(data["name"], data["age"])

    @classmethod
    def from_json(cls, json_str: str):
        """Create from JSON string."""
        data = json.loads(json_str)
        return cls(data["name"], data["age"])

    @classmethod
    def get_count(cls) -> int:
        return cls.count

    def __str__(self):
        return f"Person({self.name}, age={self.age})"

# Using different constructors
p1 = Person("Alice", 25)
p2 = Person.from_birth_year("Bob", 2000)
p3 = Person.from_dict({"name": "Charlie", "age": 30})
p4 = Person.from_json('{"name": "Diana", "age": 28}')

for p in [p1, p2, p3, p4]:
    print(f"  {p}")
print(f"Total persons: {Person.get_count()}")

# ===== CLASSMETHOD + INHERITANCE =====
print("\n--- @classmethod with Inheritance ---")

class Animal:
    def __init__(self, name: str, sound: str):
        self.name = name
        self.sound = sound

    @classmethod
    def create_default(cls):
        """cls ensures subclass creates the right type."""
        return cls("Unknown", "...")

    def speak(self):
        return f"{self.name} says {self.sound}"

class Cat(Animal):
    @classmethod
    def create_default(cls):
        return cls("Kitty", "Meow")

class Dog(Animal):
    @classmethod
    def create_default(cls):
        return cls("Buddy", "Woof")

for AnimalClass in [Animal, Cat, Dog]:
    animal = AnimalClass.create_default()
    print(f"  {type(animal).__name__}: {animal.speak()}")

# ===== @STATICMETHOD =====
print("\n--- @staticmethod ---")

class MathUtils:
    """Collection of math utility functions."""

    @staticmethod
    def is_prime(n: int) -> bool:
        if n < 2:
            return False
        for i in range(2, int(n**0.5) + 1):
            if n % i == 0:
                return False
        return True

    @staticmethod
    def fibonacci(n: int) -> list[int]:
        if n <= 0: return []
        if n == 1: return [0]
        fibs = [0, 1]
        for _ in range(2, n):
            fibs.append(fibs[-1] + fibs[-2])
        return fibs

    @staticmethod
    def gcd(a: int, b: int) -> int:
        while b:
            a, b = b, a % b
        return a

print(f"is_prime(17): {MathUtils.is_prime(17)}")
print(f"is_prime(20): {MathUtils.is_prime(20)}")
print(f"fibonacci(10): {MathUtils.fibonacci(10)}")
print(f"gcd(48, 18): {MathUtils.gcd(48, 18)}")

# ===== WHEN TO USE WHICH? =====
print("\n--- When to Use Which ---")

class Validator:
    default_min_length = 3

    def __init__(self, min_length: int = None):
        self.min_length = min_length or Validator.default_min_length

    # Instance method: needs instance state (self)
    def validate(self, value: str) -> bool:
        return len(value) >= self.min_length

    # Class method: needs class state (cls), or is an alt constructor
    @classmethod
    def set_default_min(cls, length: int):
        cls.default_min_length = length

    # Static method: needs neither — just a utility
    @staticmethod
    def is_email(value: str) -> bool:
        return "@" in value and "." in value

v = Validator(5)
print(f"validate('hi'): {v.validate('hi')}")
print(f"validate('hello'): {v.validate('hello')}")
print(f"is_email('test@x.com'): {Validator.is_email('test@x.com')}")

# ===== PRACTICAL: CONFIGURATION CLASS =====
print("\n--- Practical: Config ---")

class Config:
    _instance = None

    def __init__(self, **kwargs):
        self._settings = kwargs

    @classmethod
    def from_dict(cls, d: dict):
        return cls(**d)

    @classmethod
    def default(cls):
        return cls(debug=False, port=8080, host="localhost")

    def get(self, key: str, default=None):
        return self._settings.get(key, default)

    def __str__(self):
        return f"Config({self._settings})"

config = Config.default()
print(f"Default: {config}")
print(f"Port: {config.get('port')}")

custom = Config.from_dict({"debug": True, "port": 3000})
print(f"Custom: {custom}")

print("\n--- Summary ---")
print("Instance method: def method(self)   — needs instance data")
print("Class method:    @classmethod       — needs class data, alt constructors")
print("Static method:   @staticmethod      — utility, no class/instance needed")
