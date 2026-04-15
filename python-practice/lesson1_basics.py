# ===========================
# LESSON 1: Python Basics
# ===========================

# --- 1. Variables & Data Types ---
name = "Emmanuel"          # String (text)
age = 25                   # Integer (whole number)
height = 5.9               # Float (decimal number)
is_student = True          # Boolean (True/False)

print("--- Variables ---")
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}")
print(f"Student: {is_student}")
print(f"Name type: {type(name)}")
print(f"Age type: {type(age)}")

# --- 2. User Input ---
print("\n--- User Input ---")
favorite_color = input("What is your favorite color? ")
print(f"Cool! {favorite_color} is a great color!")

# --- 3. Math Operations ---
print("\n--- Math ---")
a = 10
b = 3
print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b}")
print(f"{a} // {b} = {a // b}")   # Floor division
print(f"{a} % {b} = {a % b}")     # Remainder
print(f"{a} ** {b} = {a ** b}")   # Power

# --- 4. If/Else (Conditions) ---
print("\n--- Conditions ---")
score = int(input("Enter your test score (0-100): "))

if score >= 90:
    print("Grade: A - Excellent! 🌟")
elif score >= 80:
    print("Grade: B - Great job! 👍")
elif score >= 70:
    print("Grade: C - Good, keep going!")
elif score >= 60:
    print("Grade: D - You can do better!")
else:
    print("Grade: F - Study harder next time!")

# --- 5. Loops ---
print("\n--- For Loop ---")
for i in range(1, 6):
    print(f"Count: {i}")

print("\n--- While Loop ---")
countdown = 5
while countdown > 0:
    print(f"Countdown: {countdown}")
    countdown -= 1
print("Liftoff! 🚀")

# --- 6. Lists ---
print("\n--- Lists ---")
fruits = ["apple", "banana", "mango", "orange"]
print(f"All fruits: {fruits}")
print(f"First fruit: {fruits[0]}")
print(f"Last fruit: {fruits[-1]}")
fruits.append("grape")
print(f"After adding grape: {fruits}")

print("\n--- Loop through list ---")
for fruit in fruits:
    print(f"I like {fruit}")

print("\n✅ Lesson 1 Complete! You learned:")
print("- Variables & data types")
print("- User input")
print("- Math operations")
print("- If/else conditions")
print("- For & while loops")
print("- Lists")
