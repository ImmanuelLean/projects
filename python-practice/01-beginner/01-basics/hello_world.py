"""
LESSON: Hello World & Print Basics
print(), f-strings, escape characters, multi-line strings.

Run: python3 hello_world.py
"""

# ===== BASIC PRINT =====
print("--- Basic Print ---")
print("Hello, World!")
print("Hello", "Python", "World")       # multiple args
print("Hello", "Python", sep=" | ")      # custom separator
print("Line 1", end=" -> ")             # custom ending
print("Line 2")

# ===== F-STRINGS (Python 3.6+) =====
print("\n--- F-Strings ---")
name = "Emmanuel"
age = 20
gpa = 3.856

print(f"Name: {name}")
print(f"Age: {age}")
print(f"GPA: {gpa:.2f}")                # 2 decimal places
print(f"Next year: {age + 1}")          # expressions inside
print(f"Name uppercased: {name.upper()}")
print(f"{'Score':<10} {'Grade':>5}")     # alignment
print(f"{95:<10} {'A':>5}")
print(f"Binary of 42: {42:b}")
print(f"Hex of 255: {255:#x}")
print(f"Big number: {1_000_000:,}")

# ===== ESCAPE CHARACTERS =====
print("\n--- Escape Characters ---")
print("Tab:\tindented")
print("Newline:\nSecond line")
print("Backslash: \\")
print("Quote: \"hello\"")
print('Single quote: \'hi\'')
print("Null char won't show: [\0]")

# ===== MULTI-LINE STRINGS =====
print("\n--- Multi-line Strings ---")
poem = """Roses are red,
Violets are blue,
Python is awesome,
And so are you!"""
print(poem)

# Raw string (no escape processing)
path = r"C:\Users\emmanuel\new_folder"
print(f"\nRaw string: {path}")

# ===== STRING REPETITION & CONCATENATION =====
print("\n--- String Operations ---")
print("Ha" * 3)               # HaHaHa
print("Hello" + " " + "World")
print("-" * 30)

# ===== REPR VS STR =====
print("\n--- repr vs str ---")
text = "Hello\tWorld"
print(f"str:  {text}")
print(f"repr: {text!r}")      # shows escape chars

# ===== PRINT TO VARIABLE (string building) =====
print("\n--- String Building ---")
import io
buffer = io.StringIO()
print("captured output", file=buffer)
result = buffer.getvalue()
print(f"Buffer contains: {result!r}")
