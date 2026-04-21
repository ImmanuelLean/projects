"""
LESSON: Mixins, Composition & Advanced OOP
Mixins, composition over inheritance, dependency injection, SOLID.

Run: python3 mixins_and_composition.py
"""
import json
import time
from abc import ABC, abstractmethod
from typing import Protocol, runtime_checkable
from dataclasses import dataclass, field, asdict

# ===== MIXINS =====
print("--- Mixins ---")

class SerializeMixin:
    """Mixin: adds JSON serialization."""

    def to_json(self) -> str:
        return json.dumps(self.__dict__, default=str)

    def to_dict(self) -> dict:
        return dict(self.__dict__)

class LoggingMixin:
    """Mixin: adds logging capabilities."""

    def log(self, message: str):
        class_name = type(self).__name__
        print(f"  [{class_name}] {message}")

class TimestampMixin:
    """Mixin: adds timestamp tracking."""

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        original_init = cls.__init__

        def new_init(self, *args, **kwargs):
            self.created_at = time.time()
            self.updated_at = time.time()
            original_init(self, *args, **kwargs)

        cls.__init__ = new_init

    def touch(self):
        self.updated_at = time.time()

# Combine mixins
class User(SerializeMixin, LoggingMixin):
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

user = User("Alice", "alice@test.com")
user.log("Created")
print(f"  JSON: {user.to_json()}")
print(f"  Dict: {user.to_dict()}")

# ===== COMPOSITION OVER INHERITANCE =====
print("\n--- Composition Over Inheritance ---")

# Instead of inheriting behavior, compose it

class Logger:
    def __init__(self, prefix: str = ""):
        self.prefix = prefix

    def info(self, msg: str):
        print(f"  [INFO{' ' + self.prefix if self.prefix else ''}] {msg}")

    def error(self, msg: str):
        print(f"  [ERROR{' ' + self.prefix if self.prefix else ''}] {msg}")

class Cache:
    def __init__(self):
        self._store: dict = {}

    def get(self, key: str):
        return self._store.get(key)

    def set(self, key: str, value):
        self._store[key] = value

    def has(self, key: str) -> bool:
        return key in self._store

class UserService:
    """Uses composition: has-a Logger, has-a Cache."""

    def __init__(self, logger: Logger, cache: Cache):
        self.logger = logger
        self.cache = cache
        self._users: dict[int, dict] = {}

    def get_user(self, user_id: int) -> dict | None:
        # Check cache first
        cached = self.cache.get(f"user:{user_id}")
        if cached:
            self.logger.info(f"Cache hit for user {user_id}")
            return cached

        # Fetch from "database"
        user = self._users.get(user_id)
        if user:
            self.cache.set(f"user:{user_id}", user)
            self.logger.info(f"Loaded user {user_id}")
        else:
            self.logger.error(f"User {user_id} not found")
        return user

    def create_user(self, user_id: int, name: str) -> dict:
        user = {"id": user_id, "name": name}
        self._users[user_id] = user
        self.cache.set(f"user:{user_id}", user)
        self.logger.info(f"Created user {name}")
        return user

service = UserService(Logger("UserSvc"), Cache())
service.create_user(1, "Alice")
service.get_user(1)  # from database
service.get_user(1)  # from cache
service.get_user(99)  # not found

# ===== DEPENDENCY INJECTION =====
print("\n--- Dependency Injection ---")

@runtime_checkable
class EmailSender(Protocol):
    def send(self, to: str, subject: str, body: str) -> bool: ...

class SMTPSender:
    def send(self, to: str, subject: str, body: str) -> bool:
        print(f"  📧 SMTP: Sending to {to}: {subject}")
        return True

class MockSender:
    def __init__(self):
        self.sent: list[dict] = []

    def send(self, to: str, subject: str, body: str) -> bool:
        self.sent.append({"to": to, "subject": subject})
        print(f"  🧪 Mock: Would send to {to}: {subject}")
        return True

class NotificationService:
    """Depends on EmailSender interface, not concrete class."""

    def __init__(self, sender: EmailSender):
        self.sender = sender

    def notify_user(self, email: str, message: str):
        self.sender.send(email, "Notification", message)

# Production: use real sender
prod_service = NotificationService(SMTPSender())
prod_service.notify_user("alice@test.com", "Your order shipped!")

# Testing: use mock sender
mock = MockSender()
test_service = NotificationService(mock)
test_service.notify_user("test@test.com", "Test notification")
print(f"  Mock sent: {mock.sent}")

# ===== SOLID PRINCIPLES =====
print("\n--- SOLID Principles ---")

# S: Single Responsibility
class UserValidator:
    def validate(self, user: dict) -> list[str]:
        errors = []
        if not user.get("name"):
            errors.append("Name required")
        if not user.get("email"):
            errors.append("Email required")
        return errors

class UserRepository:
    def __init__(self):
        self._users: dict[int, dict] = {}
        self._next_id = 1

    def save(self, user: dict) -> dict:
        user["id"] = self._next_id
        self._users[self._next_id] = user
        self._next_id += 1
        return user

    def find(self, user_id: int) -> dict | None:
        return self._users.get(user_id)

print("  S — Single Responsibility: Separate validation from storage ✅")

# O: Open/Closed — open for extension, closed for modification
class Discount(ABC):
    @abstractmethod
    def calculate(self, price: float) -> float: ...

class PercentDiscount(Discount):
    def __init__(self, percent: float):
        self.percent = percent

    def calculate(self, price: float) -> float:
        return price * (1 - self.percent / 100)

class FlatDiscount(Discount):
    def __init__(self, amount: float):
        self.amount = amount

    def calculate(self, price: float) -> float:
        return max(0, price - self.amount)

# Add new discount types without modifying existing code
class BuyOneGetOneFree(Discount):
    def calculate(self, price: float) -> float:
        return price / 2

for disc in [PercentDiscount(20), FlatDiscount(5), BuyOneGetOneFree()]:
    print(f"  O — {type(disc).__name__}: $100 → ${disc.calculate(100):.2f}")

# L: Liskov Substitution
print("  L — Liskov: All Discounts work with calculate() ✅")

# I: Interface Segregation
class Readable(Protocol):
    def read(self) -> str: ...

class Writable(Protocol):
    def write(self, data: str) -> None: ...

class ReadWriteFile:
    """Implements both interfaces."""
    def __init__(self):
        self._data = ""

    def read(self) -> str:
        return self._data

    def write(self, data: str) -> None:
        self._data = data

def process_readable(source: Readable):
    """Only requires Readable — not forced to implement write."""
    return source.read()

print("  I — Interface Segregation: Small, focused protocols ✅")

# D: Dependency Inversion
print("  D — Dependency Inversion: Depend on abstractions (Protocol) ✅")

# ===== PRACTICAL: PLUGIN ARCHITECTURE =====
print("\n--- Plugin Architecture ---")

class PluginBase(ABC):
    """Abstract base for plugins."""

    @property
    @abstractmethod
    def name(self) -> str: ...

    @abstractmethod
    def process(self, data: str) -> str: ...

class UpperPlugin(PluginBase):
    name = "upper"
    def process(self, data: str) -> str:
        return data.upper()

class ReversePlugin(PluginBase):
    name = "reverse"
    def process(self, data: str) -> str:
        return data[::-1]

class TitlePlugin(PluginBase):
    name = "title"
    def process(self, data: str) -> str:
        return data.title()

class PluginManager:
    def __init__(self):
        self._plugins: dict[str, PluginBase] = {}

    def register(self, plugin: PluginBase):
        self._plugins[plugin.name] = plugin

    def apply(self, plugin_name: str, data: str) -> str:
        plugin = self._plugins.get(plugin_name)
        if not plugin:
            raise ValueError(f"Unknown plugin: {plugin_name}")
        return plugin.process(data)

    def apply_chain(self, data: str, *plugin_names: str) -> str:
        for name in plugin_names:
            data = self.apply(name, data)
        return data

manager = PluginManager()
manager.register(UpperPlugin())
manager.register(ReversePlugin())
manager.register(TitlePlugin())

result = manager.apply("upper", "hello world")
print(f"  upper: {result}")

result = manager.apply_chain("hello world", "title", "reverse")
print(f"  title+reverse: {result}")
