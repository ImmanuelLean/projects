"""
LESSON: Constants and Naming Conventions
PEP 8 naming, constants convention, __name__, __all__.

Run: python3 constants_and_naming.py
"""

# ===== CONSTANTS CONVENTION =====
print("--- Constants (by convention, ALL_CAPS) ---")

# Python has no true constants — these are just conventions
MAX_CONNECTIONS = 100
DATABASE_URL = "localhost:5432"
PI = 3.14159265358979
GRAVITY = 9.81
HTTP_OK = 200
HTTP_NOT_FOUND = 404

print(f"MAX_CONNECTIONS = {MAX_CONNECTIONS}")
print(f"PI = {PI}")
print(f"GRAVITY = {GRAVITY}")
print(f"HTTP_OK = {HTTP_OK}")

# You CAN change them (Python won't stop you)
# PI = 3  # Bad practice, but no error

# ===== ENUM FOR TRUE CONSTANTS =====
print("\n--- Enum (actual constants) ---")
from enum import Enum, IntEnum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

class HttpStatus(IntEnum):
    OK = 200
    NOT_FOUND = 404
    SERVER_ERROR = 500

print(f"Color.RED = {Color.RED}, value = {Color.RED.value}")
print(f"HttpStatus.OK = {HttpStatus.OK}")
print(f"HttpStatus.OK == 200: {HttpStatus.OK == 200}")

# Iterate over enum
for color in Color:
    print(f"  {color.name} = {color.value}")

# ===== __name__ SPECIAL VARIABLE =====
print("\n--- __name__ ---")
print(f"__name__ = {__name__!r}")
print("When run directly: __name__ == '__main__'")
print("When imported: __name__ == module name")

# The guard pattern
if __name__ == "__main__":
    print("This code only runs when executed directly")

# ===== NAMING CONVENTIONS SUMMARY =====
print("\n--- PEP 8 Naming Summary ---")

conventions = [
    ("variable_name",    "snake_case",      "user_age, total_count"),
    ("function_name",    "snake_case",      "get_user(), calc_total()"),
    ("ClassName",        "PascalCase",      "UserProfile, HttpClient"),
    ("CONSTANT_NAME",    "UPPER_SNAKE",     "MAX_SIZE, API_KEY"),
    ("module_name",      "snake_case",      "my_module.py"),
    ("package_name",     "lowercase",       "mypackage"),
    ("_private",         "leading _",       "_internal_func()"),
    ("__mangled",        "double _",        "__secret (name mangled)"),
    ("__dunder__",       "double _ both",   "__init__, __str__"),
    ("_",                "throwaway",       "for _ in range(10)"),
]

print(f"{'Pattern':<20} {'Convention':<15} {'Examples'}")
print("-" * 65)
for pattern, convention, examples in conventions:
    print(f"{pattern:<20} {convention:<15} {examples}")

# ===== TYPE ALIASES =====
print("\n--- Type Aliases ---")
Vector = list[float]
Matrix = list[list[float]]
UserID = int

def scale(v: Vector, factor: float) -> Vector:
    """Scale a vector by a factor."""
    return [x * factor for x in v]

vec: Vector = [1.0, 2.0, 3.0]
print(f"scale({vec}, 2) = {scale(vec, 2)}")

# ===== UNDERSCORE CONVENTIONS =====
print("\n--- Underscore Usage ---")

# Single underscore: throwaway variable
for _ in range(3):
    pass
print("_ as throwaway in loops")

# Unpack with throwaway
data = (1, 2, 3, 4)
first, _, _, last = data
print(f"first={first}, last={last} (middle ignored with _)")

# Digit separator
million = 1_000_000
print(f"1_000_000 = {million}")
