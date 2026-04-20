# Lesson 2: Introduction to Functions in Python
# Functions let you group reusable blocks of code together.

import os
os.system('clear')  # Clear terminal
from rich.console import Console

console = Console()


# --- 1. Defining a Simple Function ---
def greet():
    console.print("[bold cyan]Hello, welcome to Python functions![/bold cyan]")

greet()  # Calling the function


# --- 2. Function with Parameters ---
def greet_user(name):
    console.print(f"[green]Hello, {name}! Nice to meet you.[/green]")

greet_user("Emmanuel")


# --- 3. Function with a Return Value ---
def add(a, b):
    return a + b

result = add(5, 3)
console.print(f"[yellow]5 + 3 = {result}[/yellow]")


# --- 4. Default Parameters ---
def power(base, exponent=2):
    return base ** exponent

console.print(f"[yellow]3 squared = {power(3)}[/yellow]")       # Uses default exponent=2
console.print(f"[yellow]2 cubed = {power(2, 3)}[/yellow]")      # Overrides default


# --- 5. Multiple Return Values ---
def min_max(numbers):
    return min(numbers), max(numbers)

lowest, highest = min_max([4, 1, 9, 2, 7])
console.print(f"[magenta]Min: {lowest}, Max: {highest}[/magenta]")


# --- 6. *args (Variable Number of Arguments) ---
def total(*numbers):
    return sum(numbers)

console.print(f"[blue]Total: {total(1, 2, 3, 4, 5)}[/blue]")


# --- 7. **kwargs (Keyword Arguments) ---
def introduce(**info):
    for key, value in info.items():
        console.print(f"[white]{key}: {value}[/white]")

console.print("\n[bold underline]--- Introduction ---[/bold underline]")
introduce(name="Emmanuel", role="Developer", language="Python")
