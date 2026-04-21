"""
LESSON: Creational Design Patterns
Singleton, Factory, Abstract Factory, Builder, Prototype.

Run: python3 creational_patterns.py
"""
import copy
import json
from abc import ABC, abstractmethod
from typing import Any

# ===== SINGLETON =====
print("--- Singleton Pattern ---")

class Singleton:
    """Ensures only one instance exists."""
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, value: str = "default"):
        self.value = value

s1 = Singleton("first")
s2 = Singleton("second")
print(f"  s1 is s2: {s1 is s2}")
print(f"  s1.value: {s1.value}")  # "second" — re-initialized

# ===== FACTORY METHOD =====
print("\n--- Factory Method ---")

class Notification(ABC):
    @abstractmethod
    def send(self, message: str) -> str:
        pass

class EmailNotification(Notification):
    def send(self, message: str) -> str:
        return f"📧 Email: {message}"

class SMSNotification(Notification):
    def send(self, message: str) -> str:
        return f"📱 SMS: {message}"

class PushNotification(Notification):
    def send(self, message: str) -> str:
        return f"🔔 Push: {message}"

class NotificationFactory:
    """Factory that creates the right notification type."""

    _creators = {
        "email": EmailNotification,
        "sms": SMSNotification,
        "push": PushNotification,
    }

    @classmethod
    def create(cls, channel: str) -> Notification:
        creator = cls._creators.get(channel)
        if creator is None:
            raise ValueError(f"Unknown channel: {channel}")
        return creator()

    @classmethod
    def register(cls, channel: str, creator_class):
        cls._creators[channel] = creator_class

# Usage
for channel in ["email", "sms", "push"]:
    notif = NotificationFactory.create(channel)
    print(f"  {notif.send('Hello!')}")

# ===== ABSTRACT FACTORY =====
print("\n--- Abstract Factory ---")

class Button(ABC):
    @abstractmethod
    def render(self) -> str: pass

class TextInput(ABC):
    @abstractmethod
    def render(self) -> str: pass

# Light theme family
class LightButton(Button):
    def render(self) -> str:
        return "[Light Button]"

class LightTextInput(TextInput):
    def render(self) -> str:
        return "[Light Input ____]"

# Dark theme family
class DarkButton(Button):
    def render(self) -> str:
        return "[Dark Button]"

class DarkTextInput(TextInput):
    def render(self) -> str:
        return "[Dark Input ____]"

class UIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button: pass

    @abstractmethod
    def create_text_input(self) -> TextInput: pass

class LightThemeFactory(UIFactory):
    def create_button(self) -> Button:
        return LightButton()

    def create_text_input(self) -> TextInput:
        return LightTextInput()

class DarkThemeFactory(UIFactory):
    def create_button(self) -> Button:
        return DarkButton()

    def create_text_input(self) -> TextInput:
        return DarkTextInput()

def render_ui(factory: UIFactory):
    button = factory.create_button()
    text_input = factory.create_text_input()
    print(f"  {button.render()} {text_input.render()}")

render_ui(LightThemeFactory())
render_ui(DarkThemeFactory())

# ===== BUILDER =====
print("\n--- Builder Pattern ---")

class QueryBuilder:
    """Builds SQL queries step by step."""

    def __init__(self, table: str):
        self._table = table
        self._columns = ["*"]
        self._conditions = []
        self._order_by = None
        self._limit = None

    def select(self, *columns: str) -> "QueryBuilder":
        self._columns = list(columns)
        return self

    def where(self, condition: str) -> "QueryBuilder":
        self._conditions.append(condition)
        return self

    def order_by(self, column: str, desc: bool = False) -> "QueryBuilder":
        self._order_by = f"{column} {'DESC' if desc else 'ASC'}"
        return self

    def limit(self, n: int) -> "QueryBuilder":
        self._limit = n
        return self

    def build(self) -> str:
        query = f"SELECT {', '.join(self._columns)} FROM {self._table}"
        if self._conditions:
            query += f" WHERE {' AND '.join(self._conditions)}"
        if self._order_by:
            query += f" ORDER BY {self._order_by}"
        if self._limit:
            query += f" LIMIT {self._limit}"
        return query

# Fluent interface
query = (
    QueryBuilder("users")
    .select("name", "email", "age")
    .where("age >= 18")
    .where("active = true")
    .order_by("name")
    .limit(10)
    .build()
)
print(f"  {query}")

# ===== BUILDER: COMPLEX OBJECT =====
print("\n--- Builder: HTTP Request ---")

class HttpRequest:
    def __init__(self):
        self.method = "GET"
        self.url = ""
        self.headers = {}
        self.body = None
        self.timeout = 30

    def __repr__(self):
        parts = [f"{self.method} {self.url}"]
        for k, v in self.headers.items():
            parts.append(f"  {k}: {v}")
        if self.body:
            parts.append(f"  Body: {self.body[:50]}...")
        return "\n".join(parts)

class RequestBuilder:
    def __init__(self):
        self._request = HttpRequest()

    def method(self, method: str) -> "RequestBuilder":
        self._request.method = method
        return self

    def url(self, url: str) -> "RequestBuilder":
        self._request.url = url
        return self

    def header(self, key: str, value: str) -> "RequestBuilder":
        self._request.headers[key] = value
        return self

    def json_body(self, data: Any) -> "RequestBuilder":
        self._request.body = json.dumps(data)
        self._request.headers["Content-Type"] = "application/json"
        return self

    def timeout(self, seconds: int) -> "RequestBuilder":
        self._request.timeout = seconds
        return self

    def build(self) -> HttpRequest:
        if not self._request.url:
            raise ValueError("URL is required")
        return self._request

req = (
    RequestBuilder()
    .method("POST")
    .url("https://api.example.com/users")
    .header("Authorization", "Bearer token123")
    .json_body({"name": "Alice", "age": 30})
    .timeout(10)
    .build()
)
print(f"  {req}")

# ===== PROTOTYPE =====
print("\n--- Prototype Pattern ---")

class Prototype:
    """Objects that can clone themselves."""

    def clone(self):
        return copy.deepcopy(self)

class Document(Prototype):
    def __init__(self, title: str, content: str, metadata: dict):
        self.title = title
        self.content = content
        self.metadata = metadata

    def __repr__(self):
        return f"Document('{self.title}', meta={self.metadata})"

# Create a template
template = Document(
    "Template",
    "Default content here...",
    {"author": "System", "version": 1, "tags": ["draft"]}
)

# Clone and customize
doc1 = template.clone()
doc1.title = "Report Q1"
doc1.metadata["author"] = "Alice"
doc1.metadata["tags"].append("Q1")

doc2 = template.clone()
doc2.title = "Report Q2"
doc2.metadata["author"] = "Bob"

print(f"  Template: {template}")
print(f"  Doc1: {doc1}")
print(f"  Doc2: {doc2}")
print(f"  Template unchanged: {template.metadata['tags']}")  # still ["draft"]
