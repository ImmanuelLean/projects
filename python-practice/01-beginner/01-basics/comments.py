"""
LESSON: Comments, Docstrings & Type Hints
Single-line, multi-line comments, docstrings, and basic type annotations.

Run: python3 comments.py
"""

# ===== SINGLE-LINE COMMENTS =====
# This is a single-line comment
x = 42  # inline comment after code

# ===== MULTI-LINE COMMENTS =====
# Python doesn't have true multi-line comments,
# but you can use consecutive # lines
# like this.

# Or use a multi-line string (not assigned) as a block comment:
"""
This is sometimes used as a multi-line comment.
It's technically a string expression that's ignored.
Not recommended for actual documentation — use docstrings instead.
"""

# ===== DOCSTRINGS =====
print("--- Docstrings ---")

def greet(name: str) -> str:
    """Return a greeting message for the given name.

    Args:
        name: The person's name to greet.

    Returns:
        A formatted greeting string.
    """
    return f"Hello, {name}!"

print(greet("Emmanuel"))
print(f"Function docstring: {greet.__doc__[:50]}...")

class Calculator:
    """A simple calculator with basic operations.

    Attributes:
        history: List of past calculations.
    """

    def __init__(self):
        """Initialize calculator with empty history."""
        self.history: list[str] = []

    def add(self, a: float, b: float) -> float:
        """Add two numbers and record in history."""
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result

calc = Calculator()
print(f"Class docstring: {Calculator.__doc__[:50]}...")
print(f"add(3, 4) = {calc.add(3, 4)}")

# ===== TYPE HINTS (Python 3.5+) =====
print("\n--- Type Hints ---")

# Basic type annotations
name: str = "Emmanuel"
age: int = 20
height: float = 5.9
is_student: bool = True
scores: list[int] = [95, 87, 92]
info: dict[str, str] = {"role": "student", "lang": "Python"}

print(f"name: {name} (annotated as str)")
print(f"scores: {scores} (annotated as list[int])")

# Type hints don't enforce types at runtime!
value: int = "this is actually a string"  # no error at runtime
print(f"value: {value!r} — type hints are NOT enforced at runtime")

# Function with full annotations
def calculate_average(numbers: list[float]) -> float:
    """Calculate the average of a list of numbers."""
    return sum(numbers) / len(numbers)

avg = calculate_average([85.0, 90.5, 78.0, 92.5])
print(f"Average: {avg:.1f}")

# Optional and Union (Python 3.10+ syntax)
def find_user(user_id: int) -> str | None:
    """Find user by ID, return None if not found."""
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)

print(f"User 1: {find_user(1)}")
print(f"User 3: {find_user(3)}")

# ===== ANNOTATIONS INSPECTION =====
print("\n--- Inspecting Annotations ---")
print(f"greet annotations: {greet.__annotations__}")
print(f"calculate_average annotations: {calculate_average.__annotations__}")

# ===== TODO / FIXME / NOTE CONVENTIONS =====
# TODO: Add more examples later
# FIXME: This needs error handling
# NOTE: Python ignores type hints at runtime
# HACK: Temporary workaround

print("\n--- Comment Conventions ---")
print("Common tags: TODO, FIXME, NOTE, HACK, XXX")
print("These are conventions for developer communication")
