"""
LESSON: Arithmetic Operators
+, -, *, /, //, %, **, divmod(), abs(), round(), math module.

Run: python3 arithmetic_ops.py
"""
import math

# ===== BASIC OPERATORS =====
print("--- Basic Arithmetic ---")
a, b = 17, 5

print(f"{a} + {b}  = {a + b}")       # Addition
print(f"{a} - {b}  = {a - b}")       # Subtraction
print(f"{a} * {b}  = {a * b}")       # Multiplication
print(f"{a} / {b}  = {a / b}")       # True division (float)
print(f"{a} // {b} = {a // b}")      # Floor division (int)
print(f"{a} % {b}  = {a % b}")       # Modulo (remainder)
print(f"{a} ** {b} = {a ** b}")      # Exponentiation

# ===== FLOOR DIVISION WITH NEGATIVES =====
print("\n--- Floor Division (rounds toward -∞) ---")
print(f" 17 // 5  = {17 // 5}")      # 3
print(f"-17 // 5  = {-17 // 5}")     # -4 (not -3!)
print(f" 17 // -5 = {17 // -5}")     # -4

# ===== DIVMOD =====
print("\n--- divmod() ---")
quotient, remainder = divmod(17, 5)
print(f"divmod(17, 5) = ({quotient}, {remainder})")

# Practical: convert seconds to minutes:seconds
total_seconds = 754
mins, secs = divmod(total_seconds, 60)
print(f"{total_seconds} seconds = {mins}m {secs}s")

# Convert to hours:minutes:seconds
hours, remaining = divmod(total_seconds, 3600)
mins, secs = divmod(remaining, 60)
print(f"{total_seconds} seconds = {hours}h {mins}m {secs}s")

# ===== BUILT-IN MATH FUNCTIONS =====
print("\n--- Built-in Functions ---")
print(f"abs(-42) = {abs(-42)}")
print(f"abs(-3.14) = {abs(-3.14)}")
print(f"pow(2, 10) = {pow(2, 10)}")
print(f"pow(2, 10, 100) = {pow(2, 10, 100)}")  # (2^10) % 100

print(f"\nround(3.14159) = {round(3.14159)}")
print(f"round(3.14159, 2) = {round(3.14159, 2)}")
print(f"round(2.5) = {round(2.5)}")    # banker's rounding!
print(f"round(3.5) = {round(3.5)}")    # rounds to even
print(f"round(4.5) = {round(4.5)}")

print(f"\nmax(3, 7, 2, 9) = {max(3, 7, 2, 9)}")
print(f"min(3, 7, 2, 9) = {min(3, 7, 2, 9)}")
print(f"sum([1,2,3,4,5]) = {sum([1, 2, 3, 4, 5])}")

# ===== MATH MODULE =====
print("\n--- math Module ---")
print(f"math.pi = {math.pi}")
print(f"math.e = {math.e}")
print(f"math.tau = {math.tau}")
print(f"math.inf = {math.inf}")

print(f"\nmath.sqrt(144) = {math.sqrt(144)}")
print(f"math.ceil(3.2) = {math.ceil(3.2)}")
print(f"math.floor(3.8) = {math.floor(3.8)}")
print(f"math.trunc(-3.7) = {math.trunc(-3.7)}")

print(f"\nmath.log(100, 10) = {math.log(100, 10)}")
print(f"math.log2(1024) = {math.log2(1024)}")
print(f"math.sin(math.pi/2) = {math.sin(math.pi/2):.4f}")
print(f"math.factorial(10) = {math.factorial(10)}")
print(f"math.gcd(48, 18) = {math.gcd(48, 18)}")
print(f"math.isclose(0.1+0.2, 0.3) = {math.isclose(0.1 + 0.2, 0.3)}")

# ===== FLOATING POINT GOTCHAS =====
print("\n--- Float Precision ---")
print(f"0.1 + 0.2 = {0.1 + 0.2}")
print(f"0.1 + 0.2 == 0.3: {0.1 + 0.2 == 0.3}")
print(f"math.isclose(0.1+0.2, 0.3): {math.isclose(0.1 + 0.2, 0.3)}")

from decimal import Decimal
d1 = Decimal('0.1') + Decimal('0.2')
print(f"Decimal('0.1') + Decimal('0.2') = {d1}")
