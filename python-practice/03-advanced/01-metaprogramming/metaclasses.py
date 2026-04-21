"""
LESSON: Metaclasses
type(), __new__, __init_subclass__, metaclass mechanics, practical metaclasses.

Run: python3 metaclasses.py
"""

# ===== CLASSES ARE OBJECTS =====
print("--- Classes Are Objects ---")

class Dog:
    species = "Canis familiaris"

# A class is an instance of 'type'
print(f"  type(Dog):    {type(Dog)}")
print(f"  type(42):     {type(42)}")
print(f"  type(type):   {type(type)}")  # type is its own metaclass!

# ===== CREATING CLASSES WITH type() =====
print("\n--- Creating Classes with type() ---")

# type(name, bases, namespace) creates a class dynamically
def greet(self):
    return f"Hello, I'm {self.name}!"

Person = type("Person", (), {
    "__init__": lambda self, name: setattr(self, "name", name),
    "greet": greet,
    "species": "Human",
})

p = Person("Alice")
print(f"  {p.greet()}")
print(f"  type(Person): {type(Person)}")

# With inheritance
Employee = type("Employee", (Person,), {
    "__init__": lambda self, name, role: (
        Person.__init__(self, name),
        setattr(self, "role", role),
    )[-1] if True else None,
    "describe": lambda self: f"{self.name} - {self.role}",
})

e = Employee("Bob", "Developer")
print(f"  {e.greet()}")

# ===== BASIC METACLASS =====
print("\n--- Basic Metaclass ---")

class Meta(type):
    """A metaclass that prints when a class is created."""

    def __new__(mcs, name, bases, namespace):
        print(f"  Meta.__new__: Creating class '{name}'")
        cls = super().__new__(mcs, name, bases, namespace)
        return cls

    def __init__(cls, name, bases, namespace):
        print(f"  Meta.__init__: Initializing class '{name}'")
        super().__init__(name, bases, namespace)

class MyClass(metaclass=Meta):
    x = 10

print(f"  MyClass.x = {MyClass.x}")
print(f"  type(MyClass) = {type(MyClass)}")

# ===== REGISTRY METACLASS =====
print("\n--- Registry Metaclass ---")

class RegistryMeta(type):
    """Metaclass that auto-registers all subclasses."""
    _registry = {}

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if bases:  # skip the base class itself
            mcs._registry[name] = cls
            print(f"  Registered: {name}")
        return cls

    @classmethod
    def get_registry(mcs):
        return dict(mcs._registry)

class Plugin(metaclass=RegistryMeta):
    """Base class for plugins."""
    def execute(self):
        raise NotImplementedError

class JSONPlugin(Plugin):
    def execute(self):
        return "Processing JSON"

class XMLPlugin(Plugin):
    def execute(self):
        return "Processing XML"

class CSVPlugin(Plugin):
    def execute(self):
        return "Processing CSV"

print(f"  Registry: {list(RegistryMeta.get_registry().keys())}")

# Use by name
plugin = RegistryMeta.get_registry()["JSONPlugin"]()
print(f"  {plugin.execute()}")

# ===== __init_subclass__ (Simpler Alternative) =====
print("\n--- __init_subclass__ ---")

class Animal:
    """Uses __init_subclass__ instead of metaclass for registration."""
    _kinds = {}

    def __init_subclass__(cls, sound=None, **kwargs):
        super().__init_subclass__(**kwargs)
        if sound:
            cls.sound = sound
        cls._kinds[cls.__name__] = cls
        print(f"  Registered animal: {cls.__name__} (sound={sound})")

class Cat(Animal, sound="meow"):
    pass

class Duck(Animal, sound="quack"):
    pass

class Fish(Animal):
    sound = "..."

print(f"  Cat sound: {Cat.sound}")
print(f"  All animals: {list(Animal._kinds.keys())}")

# ===== VALIDATION METACLASS =====
print("\n--- Validation Metaclass ---")

class ValidatedMeta(type):
    """Ensures classes have required attributes."""

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)

        if bases:  # skip base class
            required = getattr(cls, '_required_attrs', [])
            for attr in required:
                if attr not in namespace:
                    raise TypeError(
                        f"Class '{name}' missing required attribute: '{attr}'"
                    )
        return cls

class Serializable(metaclass=ValidatedMeta):
    _required_attrs = ['serialize', 'deserialize']

class JSONSerializer(Serializable):
    def serialize(self, data):
        import json
        return json.dumps(data)

    def deserialize(self, text):
        import json
        return json.loads(text)

print(f"  JSONSerializer created successfully ✅")

# This would fail:
# class BadSerializer(Serializable):
#     def serialize(self, data): pass
#     # Missing deserialize! → TypeError

# ===== __prepare__ =====
print("\n--- __prepare__ (Ordered Namespace) ---")

class OrderedMeta(type):
    """Metaclass that tracks attribute definition order."""

    @classmethod
    def __prepare__(mcs, name, bases):
        return {}  # dict is ordered in Python 3.7+

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        # Store the order of user-defined attributes
        cls._field_order = [
            k for k in namespace
            if not k.startswith('_') and not callable(namespace[k])
        ]
        return cls

class Config(metaclass=OrderedMeta):
    host = "localhost"
    port = 8080
    debug = True
    workers = 4

print(f"  Field order: {Config._field_order}")

# ===== SINGLETON METACLASS =====
print("\n--- Singleton Metaclass ---")

class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class AppConfig(metaclass=SingletonMeta):
    def __init__(self):
        self.settings = {"theme": "dark"}

c1 = AppConfig()
c2 = AppConfig()
print(f"  c1 is c2: {c1 is c2}")
c1.settings["theme"] = "light"
print(f"  c2.settings: {c2.settings}")

# ===== WHEN TO USE METACLASSES =====
print("\n--- When to Use Metaclasses ---")

print("""  Prefer simpler alternatives first:
  1. Decorators — for modifying individual classes
  2. __init_subclass__ — for subclass registration/validation
  3. Descriptors — for attribute behavior
  4. Metaclasses — only when you need to control class CREATION itself

  Good use cases for metaclasses:
  - ORM frameworks (Django models, SQLAlchemy)
  - Plugin systems
  - API frameworks
  - Enforcing interfaces""")
