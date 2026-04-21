"""
LESSON: Classes and Objects
class, __init__, self, instance/class variables, methods, __str__, __repr__.

Run: python3 classes_and_objects.py
"""

# ===== BASIC CLASS =====
print("--- Basic Class ---")

class Dog:
    # Class variable (shared by all instances)
    species = "Canis familiaris"
    count = 0

    def __init__(self, name: str, age: int, breed: str):
        # Instance variables (unique to each instance)
        self.name = name
        self.age = age
        self.breed = breed
        Dog.count += 1

    def bark(self) -> str:
        return f"{self.name} says: Woof!"

    def info(self) -> str:
        return f"{self.name} ({self.breed}), {self.age} years old"

    def __str__(self) -> str:
        """Human-readable string (used by print())."""
        return f"Dog({self.name}, {self.breed})"

    def __repr__(self) -> str:
        """Developer-readable string (used in debugger/REPL)."""
        return f"Dog(name={self.name!r}, age={self.age}, breed={self.breed!r})"

d1 = Dog("Rex", 5, "German Shepherd")
d2 = Dog("Buddy", 3, "Golden Retriever")

print(d1.bark())
print(d1.info())
print(f"str:  {d1}")
print(f"repr: {d1!r}")
print(f"Species: {Dog.species}")
print(f"Total dogs: {Dog.count}")

# ===== INSTANCE VS CLASS VARIABLES =====
print("\n--- Instance vs Class Variables ---")

class Counter:
    total = 0          # class variable

    def __init__(self, name):
        self.name = name   # instance variable
        self.count = 0     # instance variable
        Counter.total += 1

    def increment(self):
        self.count += 1

c1 = Counter("A")
c2 = Counter("B")
c1.increment()
c1.increment()
c2.increment()

print(f"c1.count = {c1.count}, c2.count = {c2.count}")
print(f"Counter.total = {Counter.total}")

# ===== METHODS =====
print("\n--- Different Method Types ---")

class MyClass:
    class_var = "shared"

    def __init__(self, value):
        self.value = value

    # Regular method — takes self, accesses instance
    def instance_method(self):
        return f"Instance method: value={self.value}"

    # Class method — takes cls, accesses class
    @classmethod
    def class_method(cls):
        return f"Class method: class_var={cls.class_var}"

    # Static method — no self/cls, just a function in the class namespace
    @staticmethod
    def static_method(x, y):
        return f"Static method: {x} + {y} = {x + y}"

obj = MyClass(42)
print(obj.instance_method())
print(MyClass.class_method())
print(MyClass.static_method(3, 4))

# ===== PRACTICAL: Bank Account =====
print("\n--- Practical: BankAccount ---")

class BankAccount:
    def __init__(self, owner: str, balance: float = 0):
        self.owner = owner
        self.balance = balance
        self._transactions: list[str] = []

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            print(f"  Invalid deposit: {amount}")
            return
        self.balance += amount
        self._transactions.append(f"+${amount:.2f}")
        print(f"  Deposited ${amount:.2f}")

    def withdraw(self, amount: float) -> bool:
        if amount > self.balance:
            print(f"  Insufficient funds for ${amount:.2f}")
            return False
        self.balance -= amount
        self._transactions.append(f"-${amount:.2f}")
        print(f"  Withdrew ${amount:.2f}")
        return True

    def statement(self) -> None:
        print(f"\n  Account: {self.owner}")
        print(f"  Balance: ${self.balance:.2f}")
        print(f"  Transactions: {', '.join(self._transactions)}")

    def __str__(self) -> str:
        return f"BankAccount({self.owner}, ${self.balance:.2f})"

    def __repr__(self) -> str:
        return f"BankAccount(owner={self.owner!r}, balance={self.balance})"

acc = BankAccount("Emmanuel")
acc.deposit(1000)
acc.deposit(500)
acc.withdraw(200)
acc.withdraw(2000)
acc.statement()
print(f"\n{acc}")
print(f"{acc!r}")

# ===== COMPARISON OF __str__ vs __repr__ =====
print("\n--- __str__ vs __repr__ ---")
print("__str__:  Called by str() and print(). Human-friendly.")
print("__repr__: Called by repr() and debugger. Should be unambiguous.")
print("If only one defined, implement __repr__ — it's the fallback.")

# ===== ATTRIBUTES =====
print("\n--- Dynamic Attributes ---")

class Flexible:
    pass

obj = Flexible()
obj.x = 10          # add attribute dynamically
obj.name = "test"

print(f"obj.x = {obj.x}")
print(f"hasattr(obj, 'x'): {hasattr(obj, 'x')}")
print(f"getattr(obj, 'y', 'default'): {getattr(obj, 'y', 'default')}")

setattr(obj, 'z', 99)
print(f"After setattr: obj.z = {obj.z}")
print(f"vars(obj): {vars(obj)}")
