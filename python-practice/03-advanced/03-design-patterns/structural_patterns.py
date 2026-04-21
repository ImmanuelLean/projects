"""
LESSON: Structural Design Patterns
Adapter, Decorator, Proxy, Facade, Composite.

Run: python3 structural_patterns.py
"""
from abc import ABC, abstractmethod
from functools import wraps
import time

# ===== ADAPTER =====
print("--- Adapter Pattern ---")

# Old interface (third-party or legacy code)
class OldPaymentGateway:
    def make_payment(self, amount_cents: int, currency: str) -> dict:
        return {"paid": amount_cents, "curr": currency, "ok": True}

# New interface we want
class PaymentProcessor(ABC):
    @abstractmethod
    def pay(self, amount: float, currency: str = "USD") -> bool:
        pass

# Adapter bridges old → new
class PaymentAdapter(PaymentProcessor):
    def __init__(self, old_gateway: OldPaymentGateway):
        self._gateway = old_gateway

    def pay(self, amount: float, currency: str = "USD") -> bool:
        cents = int(amount * 100)
        result = self._gateway.make_payment(cents, currency)
        return result["ok"]

adapter = PaymentAdapter(OldPaymentGateway())
print(f"  Payment successful: {adapter.pay(29.99)}")

# ===== DECORATOR PATTERN (Structural) =====
print("\n--- Decorator Pattern ---")

class DataSource(ABC):
    @abstractmethod
    def write(self, data: str) -> None: pass

    @abstractmethod
    def read(self) -> str: pass

class FileDataSource(DataSource):
    def __init__(self):
        self._data = ""

    def write(self, data: str) -> None:
        self._data = data

    def read(self) -> str:
        return self._data

class DataSourceDecorator(DataSource):
    """Base decorator."""
    def __init__(self, source: DataSource):
        self._wrapped = source

    def write(self, data: str) -> None:
        self._wrapped.write(data)

    def read(self) -> str:
        return self._wrapped.read()

class EncryptionDecorator(DataSourceDecorator):
    """Adds encryption layer."""
    def write(self, data: str) -> None:
        encrypted = data[::-1]  # simple reversal as "encryption"
        print(f"  [Encrypt] Writing encrypted data")
        super().write(encrypted)

    def read(self) -> str:
        data = super().read()
        decrypted = data[::-1]
        print(f"  [Encrypt] Reading decrypted data")
        return decrypted

class CompressionDecorator(DataSourceDecorator):
    """Adds compression layer."""
    def write(self, data: str) -> None:
        compressed = data.replace("  ", " ")  # simplified
        print(f"  [Compress] Compressing data")
        super().write(compressed)

    def read(self) -> str:
        data = super().read()
        print(f"  [Compress] Decompressing data")
        return data

# Stack decorators
source = CompressionDecorator(EncryptionDecorator(FileDataSource()))
source.write("Hello World")
result = source.read()
print(f"  Result: {result}")

# ===== PROXY =====
print("\n--- Proxy Pattern ---")

class Database(ABC):
    @abstractmethod
    def query(self, sql: str) -> list: pass

class RealDatabase(Database):
    def __init__(self):
        print("  [RealDB] Expensive connection established")

    def query(self, sql: str) -> list:
        return [{"id": 1, "data": f"result for: {sql}"}]

class CachingProxy(Database):
    """Proxy that caches query results."""

    def __init__(self):
        self._db = None  # lazy initialization
        self._cache = {}

    def _get_db(self) -> RealDatabase:
        if self._db is None:
            self._db = RealDatabase()
        return self._db

    def query(self, sql: str) -> list:
        if sql in self._cache:
            print(f"  [Cache] HIT: {sql}")
            return self._cache[sql]

        print(f"  [Cache] MISS: {sql}")
        result = self._get_db().query(sql)
        self._cache[sql] = result
        return result

db = CachingProxy()  # no real connection yet
db.query("SELECT * FROM users")  # MISS, creates connection
db.query("SELECT * FROM users")  # HIT
db.query("SELECT * FROM posts")  # MISS

# ===== ACCESS CONTROL PROXY =====
print("\n--- Access Control Proxy ---")

class SecureDatabase(Database):
    """Proxy that checks permissions."""

    def __init__(self, db: Database, allowed_users: set):
        self._db = db
        self._allowed = allowed_users
        self._current_user = None

    def login(self, user: str):
        self._current_user = user

    def query(self, sql: str) -> list:
        if self._current_user not in self._allowed:
            raise PermissionError(f"User '{self._current_user}' not authorized")
        return self._db.query(sql)

secure_db = SecureDatabase(CachingProxy(), {"admin", "analyst"})

secure_db.login("admin")
result = secure_db.query("SELECT * FROM secrets")
print(f"  Admin query: {result}")

secure_db.login("guest")
try:
    secure_db.query("SELECT * FROM secrets")
except PermissionError as e:
    print(f"  {e}")

# ===== FACADE =====
print("\n--- Facade Pattern ---")

class VideoConverter:
    def convert(self, filename: str, format: str) -> str:
        return f"{filename}.{format}"

class AudioExtractor:
    def extract(self, video: str) -> str:
        return f"audio_{video}"

class Compressor:
    def compress(self, file: str, quality: int) -> str:
        return f"compressed_{file}_q{quality}"

class VideoExportFacade:
    """Simplified interface to a complex subsystem."""

    def __init__(self):
        self._converter = VideoConverter()
        self._audio = AudioExtractor()
        self._compressor = Compressor()

    def export(self, filename: str, format: str = "mp4", quality: int = 80) -> dict:
        video = self._converter.convert(filename, format)
        audio = self._audio.extract(video)
        compressed = self._compressor.compress(video, quality)

        return {
            "video": compressed,
            "audio": audio,
            "format": format,
            "quality": quality,
        }

# Simple one-call interface
facade = VideoExportFacade()
result = facade.export("my_video", "mp4", 90)
print(f"  Export result: {result}")

# ===== COMPOSITE =====
print("\n--- Composite Pattern ---")

class FileSystemItem(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def get_size(self) -> int: pass

    @abstractmethod
    def display(self, indent: int = 0) -> None: pass

class File(FileSystemItem):
    def __init__(self, name: str, size: int):
        super().__init__(name)
        self.size = size

    def get_size(self) -> int:
        return self.size

    def display(self, indent: int = 0) -> None:
        print(f"{'  ' * indent}  📄 {self.name} ({self.size}B)")

class Directory(FileSystemItem):
    def __init__(self, name: str):
        super().__init__(name)
        self.children: list[FileSystemItem] = []

    def add(self, item: FileSystemItem) -> "Directory":
        self.children.append(item)
        return self

    def get_size(self) -> int:
        return sum(child.get_size() for child in self.children)

    def display(self, indent: int = 0) -> None:
        print(f"{'  ' * indent}  📁 {self.name}/ ({self.get_size()}B)")
        for child in self.children:
            child.display(indent + 1)

# Build a file tree
root = Directory("project")
root.add(File("README.md", 1024))
root.add(File(".gitignore", 256))

src = Directory("src")
src.add(File("main.py", 4096))
src.add(File("utils.py", 2048))

tests = Directory("tests")
tests.add(File("test_main.py", 3072))

root.add(src)
root.add(tests)

root.display()
print(f"  Total size: {root.get_size()} bytes")
