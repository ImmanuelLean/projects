"""
LESSON: Bitwise Operators
&, |, ^, ~, <<, >>, practical bit manipulation.

Run: python3 bitwise_ops.py
"""

def show_binary(name, value, bits=8):
    """Display a value in decimal, binary, and hex."""
    if value < 0:
        print(f"  {name:>12} = {value:>5}  bin: {value & 0xFF:0{bits}b}  hex: {value & 0xFF:#04x}")
    else:
        print(f"  {name:>12} = {value:>5}  bin: {value:0{bits}b}  hex: {value:#04x}")

# ===== BASIC BITWISE OPERATORS =====
print("--- Bitwise Operators ---")
a = 0b11001010  # 202
b = 0b10110101  # 181

show_binary("a", a)
show_binary("b", b)
print()

show_binary("a & b (AND)", a & b)     # both bits 1
show_binary("a | b (OR)", a | b)      # either bit 1
show_binary("a ^ b (XOR)", a ^ b)     # bits differ
show_binary("~a (NOT)", ~a)           # flip all bits
show_binary("a << 2 (LSHIFT)", a << 2)
show_binary("a >> 2 (RSHIFT)", a >> 2)

# ===== BIT SHIFT AS MULTIPLY/DIVIDE =====
print("\n--- Bit Shifting = Multiply/Divide by 2 ---")
x = 10
print(f"  {x} << 1 = {x << 1}  (x * 2)")
print(f"  {x} << 2 = {x << 2}  (x * 4)")
print(f"  {x} << 3 = {x << 3}  (x * 8)")
print(f"  {x} >> 1 = {x >> 1}  (x // 2)")

# ===== PRACTICAL: FLAGS / PERMISSIONS =====
print("\n--- Practical: Permission Flags ---")
READ    = 0b100  # 4
WRITE   = 0b010  # 2
EXECUTE = 0b001  # 1

# Set permissions
user_perms = READ | WRITE       # read + write
print(f"User perms (rw-): {user_perms:03b} = {user_perms}")

admin_perms = READ | WRITE | EXECUTE
print(f"Admin perms (rwx): {admin_perms:03b} = {admin_perms}")

# Check permission
has_read = bool(user_perms & READ)
has_exec = bool(user_perms & EXECUTE)
print(f"\nUser has READ: {has_read}")
print(f"User has EXECUTE: {has_exec}")

# Add permission
user_perms |= EXECUTE
print(f"After adding EXECUTE: {user_perms:03b}")

# Remove permission
user_perms &= ~WRITE
print(f"After removing WRITE: {user_perms:03b}")

# Toggle permission
user_perms ^= READ
print(f"After toggling READ: {user_perms:03b}")

# ===== PRACTICAL: CHECK ODD/EVEN =====
print("\n--- Practical: Odd/Even Check ---")
for n in range(8):
    parity = "odd" if n & 1 else "even"
    print(f"  {n} & 1 = {n & 1} -> {parity}")

# ===== PRACTICAL: POWER OF 2 CHECK =====
print("\n--- Practical: Power of 2 ---")
def is_power_of_2(n):
    return n > 0 and (n & (n - 1)) == 0

for n in [1, 2, 3, 4, 8, 15, 16, 32, 100, 128]:
    print(f"  {n:>4} is power of 2: {is_power_of_2(n)}")

# ===== PRACTICAL: BIT COUNTING =====
print("\n--- Practical: Count Set Bits ---")
def count_bits(n):
    return bin(n).count('1')

for n in [0, 1, 7, 15, 42, 255]:
    print(f"  {n:>4} ({n:08b}) has {count_bits(n)} set bits")

# ===== PRACTICAL: XOR TRICKS =====
print("\n--- XOR Tricks ---")

# Swap without temp
a, b = 5, 9
print(f"Before swap: a={a}, b={b}")
a ^= b
b ^= a
a ^= b
print(f"After XOR swap: a={a}, b={b}")

# Find the unique element
nums = [2, 3, 5, 3, 2]
unique = 0
for n in nums:
    unique ^= n
print(f"\nUnique in {nums}: {unique}")
