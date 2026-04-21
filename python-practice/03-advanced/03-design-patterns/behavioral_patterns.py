"""
LESSON: Behavioral Design Patterns
Observer, Strategy, Command, Iterator, State.

Run: python3 behavioral_patterns.py
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Callable, Any

# ===== OBSERVER =====
print("--- Observer Pattern ---")

class EventEmitter:
    """Simple event system (publish-subscribe)."""

    def __init__(self):
        self._listeners: dict[str, list[Callable]] = {}

    def on(self, event: str, callback: Callable):
        self._listeners.setdefault(event, []).append(callback)

    def off(self, event: str, callback: Callable):
        if event in self._listeners:
            self._listeners[event].remove(callback)

    def emit(self, event: str, *args, **kwargs):
        for callback in self._listeners.get(event, []):
            callback(*args, **kwargs)

# Usage
store = EventEmitter()

def on_price_change(product, old, new):
    print(f"  📊 Price alert: {product} ${old} → ${new}")

def on_price_drop(product, old, new):
    if new < old:
        print(f"  🔥 DEAL: {product} dropped to ${new}!")

store.on("price_change", on_price_change)
store.on("price_change", on_price_drop)

store.emit("price_change", "Widget", 29.99, 19.99)
store.emit("price_change", "Gadget", 49.99, 59.99)

# ===== STRATEGY =====
print("\n--- Strategy Pattern ---")

class SortStrategy(ABC):
    @abstractmethod
    def sort(self, data: list) -> list: pass

class BubbleSort(SortStrategy):
    def sort(self, data: list) -> list:
        arr = data.copy()
        n = len(arr)
        for i in range(n):
            for j in range(0, n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
        return arr

class QuickSort(SortStrategy):
    def sort(self, data: list) -> list:
        if len(data) <= 1:
            return data
        pivot = data[len(data) // 2]
        left = [x for x in data if x < pivot]
        middle = [x for x in data if x == pivot]
        right = [x for x in data if x > pivot]
        return self.sort(left) + middle + self.sort(right)

class Sorter:
    def __init__(self, strategy: SortStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: SortStrategy):
        self._strategy = strategy

    def sort(self, data: list) -> list:
        name = type(self._strategy).__name__
        result = self._strategy.sort(data)
        print(f"  [{name}] {data} → {result}")
        return result

data = [64, 34, 25, 12, 22, 11, 90]
sorter = Sorter(BubbleSort())
sorter.sort(data)

sorter.set_strategy(QuickSort())
sorter.sort(data)

# Pythonic strategy: just use functions
print("\n  Pythonic Strategy (functions):")

def sort_ascending(data): return sorted(data)
def sort_descending(data): return sorted(data, reverse=True)
def sort_by_abs(data): return sorted(data, key=abs)

for strategy in [sort_ascending, sort_descending, sort_by_abs]:
    result = strategy([-3, 1, -4, 1, 5, -9])
    print(f"  {strategy.__name__}: {result}")

# ===== COMMAND =====
print("\n--- Command Pattern ---")

@dataclass
class Command:
    """Base command with undo support."""
    def execute(self) -> Any: ...
    def undo(self) -> None: ...

class TextEditor:
    def __init__(self):
        self.text = ""
        self._history: list[Command] = []

    def execute(self, command: "TextCommand"):
        command.execute()
        self._history.append(command)

    def undo(self):
        if self._history:
            cmd = self._history.pop()
            cmd.undo()

@dataclass
class InsertCommand:
    editor: TextEditor
    text: str
    position: int = -1

    def execute(self):
        if self.position == -1:
            self.position = len(self.editor.text)
        self.editor.text = (
            self.editor.text[:self.position] +
            self.text +
            self.editor.text[self.position:]
        )

    def undo(self):
        self.editor.text = (
            self.editor.text[:self.position] +
            self.editor.text[self.position + len(self.text):]
        )

@dataclass
class DeleteCommand:
    editor: TextEditor
    position: int
    length: int
    _deleted: str = ""

    def execute(self):
        self._deleted = self.editor.text[self.position:self.position + self.length]
        self.editor.text = (
            self.editor.text[:self.position] +
            self.editor.text[self.position + self.length:]
        )

    def undo(self):
        self.editor.text = (
            self.editor.text[:self.position] +
            self._deleted +
            self.editor.text[self.position:]
        )

editor = TextEditor()
editor.execute(InsertCommand(editor, "Hello World"))
print(f"  After insert: '{editor.text}'")

editor.execute(InsertCommand(editor, ", Beautiful", 5))
print(f"  After insert: '{editor.text}'")

editor.execute(DeleteCommand(editor, 5, 11))
print(f"  After delete: '{editor.text}'")

editor.undo()
print(f"  After undo:   '{editor.text}'")

editor.undo()
print(f"  After undo:   '{editor.text}'")

# ===== STATE =====
print("\n--- State Pattern ---")

class OrderState(ABC):
    @abstractmethod
    def proceed(self, order: "Order") -> None: pass

    @abstractmethod
    def cancel(self, order: "Order") -> None: pass

    @property
    @abstractmethod
    def name(self) -> str: pass

class PendingState(OrderState):
    name = "Pending"

    def proceed(self, order):
        print(f"  Order {order.id}: Pending → Confirmed")
        order.state = ConfirmedState()

    def cancel(self, order):
        print(f"  Order {order.id}: Pending → Cancelled")
        order.state = CancelledState()

class ConfirmedState(OrderState):
    name = "Confirmed"

    def proceed(self, order):
        print(f"  Order {order.id}: Confirmed → Shipped")
        order.state = ShippedState()

    def cancel(self, order):
        print(f"  Order {order.id}: Confirmed → Cancelled (refund issued)")
        order.state = CancelledState()

class ShippedState(OrderState):
    name = "Shipped"

    def proceed(self, order):
        print(f"  Order {order.id}: Shipped → Delivered ✅")
        order.state = DeliveredState()

    def cancel(self, order):
        print(f"  Order {order.id}: Cannot cancel — already shipped!")

class DeliveredState(OrderState):
    name = "Delivered"

    def proceed(self, order):
        print(f"  Order {order.id}: Already delivered")

    def cancel(self, order):
        print(f"  Order {order.id}: Cannot cancel — already delivered!")

class CancelledState(OrderState):
    name = "Cancelled"

    def proceed(self, order):
        print(f"  Order {order.id}: Cannot proceed — cancelled!")

    def cancel(self, order):
        print(f"  Order {order.id}: Already cancelled")

class Order:
    def __init__(self, order_id: int):
        self.id = order_id
        self.state: OrderState = PendingState()

    def proceed(self):
        self.state.proceed(self)

    def cancel(self):
        self.state.cancel(self)

    def __repr__(self):
        return f"Order({self.id}, state={self.state.name})"

order = Order(1001)
print(f"  {order}")
order.proceed()   # Pending → Confirmed
order.proceed()   # Confirmed → Shipped
order.cancel()    # Can't cancel shipped!
order.proceed()   # Shipped → Delivered

# ===== CHAIN OF RESPONSIBILITY =====
print("\n--- Chain of Responsibility ---")

class Handler(ABC):
    def __init__(self):
        self._next: Handler | None = None

    def set_next(self, handler: "Handler") -> "Handler":
        self._next = handler
        return handler

    def handle(self, request: dict) -> str | None:
        if self._next:
            return self._next.handle(request)
        return None

class AuthHandler(Handler):
    def handle(self, request: dict) -> str | None:
        if not request.get("token"):
            return "❌ Auth: No token provided"
        print(f"  ✅ Auth: Token verified")
        return super().handle(request)

class RateLimitHandler(Handler):
    def __init__(self, max_requests: int = 100):
        super().__init__()
        self.max = max_requests
        self.count = 0

    def handle(self, request: dict) -> str | None:
        self.count += 1
        if self.count > self.max:
            return "❌ Rate limit exceeded"
        print(f"  ✅ Rate limit: {self.count}/{self.max}")
        return super().handle(request)

class ValidationHandler(Handler):
    def handle(self, request: dict) -> str | None:
        if not request.get("body"):
            return "❌ Validation: Empty body"
        print(f"  ✅ Validation: Body present")
        return super().handle(request)

# Build chain
auth = AuthHandler()
rate = RateLimitHandler(max_requests=10)
validation = ValidationHandler()

auth.set_next(rate).set_next(validation)

# Process request through chain
request = {"token": "abc123", "body": {"name": "Alice"}}
result = auth.handle(request)
print(f"  Result: {result or 'All checks passed ✅'}")

# Failed request
bad_request = {"body": {"name": "Bob"}}
result = auth.handle(bad_request)
print(f"  Result: {result}")
