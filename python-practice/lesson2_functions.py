# Lesson 2: Introduction to Functions in Python
# Functions let you group reusable blocks of code together.

# --- 1. Defining a Simple Function ---
def greet():
    print("Hello, welcome to Python functions!")

greet()  # Calling the function


# --- 2. Function with Parameters ---
def greet_user(name):
    print(f"Hello, {name}! Nice to meet you.")

greet_user("Emmanuel")


# --- 3. Function with a Return Value ---
def add(a, b):
    return a + b

result = add(5, 3)
print(f"5 + 3 = {result}")


# --- 4. Default Parameters ---
def power(base, exponent=2):
    return base ** exponent

print(f"3 squared = {power(3)}")       # Uses default exponent=2
print(f"2 cubed = {power(2, 3)}")      # Overrides default


# --- 5. Multiple Return Values ---
def min_max(numbers):
    return min(numbers), max(numbers)

lowest, highest = min_max([4, 1, 9, 2, 7])
print(f"Min: {lowest}, Max: {highest}")


# --- 6. *args (Variable Number of Arguments) ---
def total(*numbers):
    return sum(numbers)

print(f"Total: {total(1, 2, 3, 4, 5)}")


# --- 7. **kwargs (Keyword Arguments) ---
def introduce(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

print("--- Introduction ---")
introduce(name="Emmanuel", role="Developer", language="Python")
