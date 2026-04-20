"""
LESSON: If/Else and Conditional Logic
if/elif/else, ternary operator, match-case (3.10+), truthiness.

Run: python3 if_else.py
"""

# ===== BASIC IF/ELIF/ELSE =====
print("--- Basic If/Elif/Else ---")
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Score: {score} -> Grade: {grade}")

# ===== TERNARY (CONDITIONAL EXPRESSION) =====
print("\n--- Ternary Operator ---")
age = 20
status = "adult" if age >= 18 else "minor"
print(f"Age {age}: {status}")

# Nested ternary (use sparingly)
x = 0
sign = "positive" if x > 0 else "negative" if x < 0 else "zero"
print(f"x={x}: {sign}")

# ===== TRUTHINESS =====
print("\n--- Truthiness ---")
# Falsy: 0, 0.0, "", [], {}, set(), None, False
# Truthy: everything else

items = [1, 2, 3]
if items:  # Pythonic — don't do: if len(items) > 0
    print(f"List has {len(items)} items")

name = ""
if not name:  # Pythonic check for empty string
    print("Name is empty")

# ===== MULTIPLE CONDITIONS =====
print("\n--- Multiple Conditions ---")
temp = 72
humidity = 45

if temp > 85 and humidity > 60:
    weather = "hot and humid"
elif temp > 85:
    weather = "hot"
elif temp < 32:
    weather = "freezing"
elif 65 <= temp <= 80 and humidity < 60:
    weather = "perfect"
else:
    weather = "mild"

print(f"Temp: {temp}°F, Humidity: {humidity}% -> {weather}")

# ===== CONDITIONAL WITH 'in' =====
print("\n--- Membership Testing ---")
day = "Saturday"
if day in ("Saturday", "Sunday"):
    print(f"{day} is a weekend")
else:
    print(f"{day} is a weekday")

allowed_roles = {"admin", "moderator", "editor"}
user_role = "admin"
if user_role in allowed_roles:
    print(f"Role '{user_role}' has access")

# ===== WALRUS OPERATOR (:=) Python 3.8+ =====
print("\n--- Walrus Operator (:=) ---")
data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Without walrus
filtered = [x for x in data if x ** 2 > 50]
print(f"Squares > 50: {filtered}")

# With walrus — compute once, use twice
results = [(x, y) for x in data if (y := x ** 2) > 50]
print(f"With walrus: {results}")

# ===== MATCH-CASE (Python 3.10+) =====
print("\n--- Match-Case (Python 3.10+) ---")

def handle_command(command):
    match command.split():
        case ["quit"]:
            return "Goodbye!"
        case ["hello", name]:
            return f"Hello, {name}!"
        case ["add", x, y]:
            return f"Sum: {int(x) + int(y)}"
        case ["move", direction] if direction in ("up", "down", "left", "right"):
            return f"Moving {direction}"
        case _:
            return f"Unknown command: {command}"

commands = ["quit", "hello Emmanuel", "add 3 4", "move up", "fly away"]
for cmd in commands:
    print(f"  '{cmd}' -> {handle_command(cmd)}")

# Match with patterns
def classify_point(point):
    match point:
        case (0, 0):
            return "origin"
        case (x, 0):
            return f"on x-axis at {x}"
        case (0, y):
            return f"on y-axis at {y}"
        case (x, y) if x == y:
            return f"on diagonal at ({x}, {y})"
        case (x, y):
            return f"point at ({x}, {y})"

points = [(0, 0), (3, 0), (0, 5), (4, 4), (2, 7)]
for p in points:
    print(f"  {p} -> {classify_point(p)}")

# ===== GUARD CLAUSES =====
print("\n--- Guard Clauses (Early Return) ---")

def process_age(age):
    if age < 0:
        return "Invalid: negative age"
    if age < 13:
        return "child"
    if age < 18:
        return "teenager"
    if age < 65:
        return "adult"
    return "senior"

for a in [-1, 5, 15, 30, 70]:
    print(f"  age {a:>3}: {process_age(a)}")
