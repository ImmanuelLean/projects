"""
LESSON: File I/O
open/read/write, with statement, csv, json, pathlib basics.

Run: python3 file_io.py
"""
import os
import csv
import json
from pathlib import Path

# Create temp directory for demo files
DEMO_DIR = Path("/tmp/python_file_io_demo")
DEMO_DIR.mkdir(exist_ok=True)

# ===== WRITING FILES =====
print("--- Writing Files ---")

# Write text file
filepath = DEMO_DIR / "hello.txt"
with open(filepath, 'w') as f:
    f.write("Hello, World!\n")
    f.write("This is line 2\n")
    f.write("And line 3\n")
print(f"Wrote: {filepath}")

# writelines
filepath2 = DEMO_DIR / "lines.txt"
lines = ["Line A\n", "Line B\n", "Line C\n"]
with open(filepath2, 'w') as f:
    f.writelines(lines)
print(f"Wrote: {filepath2}")

# Append mode
with open(filepath, 'a') as f:
    f.write("Appended line 4\n")
print(f"Appended to: {filepath}")

# ===== READING FILES =====
print("\n--- Reading Files ---")

# Read entire file
with open(filepath, 'r') as f:
    content = f.read()
print(f"read():\n{content}")

# Read lines into list
with open(filepath, 'r') as f:
    lines = f.readlines()
print(f"readlines(): {lines}")

# Read line by line (memory efficient)
print("Line by line:")
with open(filepath, 'r') as f:
    for line_num, line in enumerate(f, 1):
        print(f"  {line_num}: {line.rstrip()}")

# Read first N characters
with open(filepath, 'r') as f:
    first_13 = f.read(13)
print(f"\nFirst 13 chars: {first_13!r}")

# ===== WITH STATEMENT =====
print("\n--- With Statement (Context Manager) ---")
print("'with' auto-closes the file, even on exceptions")
print("ALWAYS prefer 'with open(...)' over manual open/close")

# Without with (bad practice)
# f = open('file.txt')
# data = f.read()
# f.close()  # easy to forget!

# ===== CSV FILES =====
print("\n--- CSV Files ---")

# Write CSV
csv_path = DEMO_DIR / "students.csv"
students = [
    ["Name", "Age", "Grade"],
    ["Alice", 20, "A"],
    ["Bob", 22, "B+"],
    ["Charlie", 21, "A-"],
]

with open(csv_path, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(students)
print(f"Wrote CSV: {csv_path}")

# Read CSV
with open(csv_path, 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        print(f"  {row}")

# DictReader / DictWriter
print("\nCSV as dicts:")
with open(csv_path, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"  {dict(row)}")

# ===== JSON FILES =====
print("\n--- JSON Files ---")

data = {
    "name": "Emmanuel",
    "age": 20,
    "languages": ["Python", "C++", "JavaScript"],
    "education": {
        "university": "Example University",
        "year": 3
    }
}

# Write JSON
json_path = DEMO_DIR / "profile.json"
with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)
print(f"Wrote JSON: {json_path}")

# Read JSON
with open(json_path, 'r') as f:
    loaded = json.load(f)
print(f"Loaded: {loaded}")
print(f"Name: {loaded['name']}")
print(f"Languages: {loaded['languages']}")

# JSON string conversion
json_str = json.dumps(data, indent=2)
print(f"\njson.dumps():\n{json_str[:100]}...")

parsed = json.loads('{"key": "value", "num": 42}')
print(f"json.loads(): {parsed}")

# ===== PATHLIB =====
print("\n--- pathlib ---")

p = Path("/home/emmanuel/projects/test.py")
print(f"Path: {p}")
print(f"name: {p.name}")
print(f"stem: {p.stem}")
print(f"suffix: {p.suffix}")
print(f"parent: {p.parent}")
print(f"parts: {p.parts}")

# Path operations
print(f"\nJoin: {Path('/home') / 'user' / 'docs'}")
print(f"Resolve: {Path('.').resolve()}")
print(f"Home: {Path.home()}")

# Check existence
print(f"\n{DEMO_DIR} exists: {DEMO_DIR.exists()}")
print(f"{DEMO_DIR} is_dir: {DEMO_DIR.is_dir()}")
print(f"{json_path} is_file: {json_path.is_file()}")

# List directory
print(f"\nFiles in {DEMO_DIR}:")
for f in sorted(DEMO_DIR.iterdir()):
    size = f.stat().st_size
    print(f"  {f.name:20} {size:>6} bytes")

# Glob
print(f"\n*.txt files: {[f.name for f in DEMO_DIR.glob('*.txt')]}")

# Read/write with pathlib (Python 3.5+)
quick_path = DEMO_DIR / "quick.txt"
quick_path.write_text("Quick write with pathlib!\nLine 2\n")
content = quick_path.read_text()
print(f"\nPathlib read: {content.strip()}")

# ===== FILE MODES SUMMARY =====
print("\n--- File Modes ---")
modes = [
    ("'r'",  "Read (default). Error if not exists."),
    ("'w'",  "Write. Creates or truncates."),
    ("'a'",  "Append. Creates if not exists."),
    ("'x'",  "Exclusive create. Error if exists."),
    ("'rb'", "Read binary."),
    ("'wb'", "Write binary."),
    ("'r+'", "Read and write."),
]
for mode, desc in modes:
    print(f"  {mode:5} — {desc}")

# ===== CLEANUP =====
import shutil
shutil.rmtree(DEMO_DIR)
print(f"\nCleaned up {DEMO_DIR}")
