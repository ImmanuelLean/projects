"""
LESSON: Strings Deep Dive
String methods, formatting, regex basics, slicing tricks.

Run: python3 strings_deep.py
"""
import re

# ===== STRING METHODS =====
print("--- String Methods ---")
s = "  Hello, World!  "

print(f"Original: {s!r}")
print(f"strip():  {s.strip()!r}")
print(f"lstrip(): {s.lstrip()!r}")
print(f"rstrip(): {s.rstrip()!r}")

s = "Hello, World!"
print(f"\nupper():    {s.upper()}")
print(f"lower():    {s.lower()}")
print(f"title():    {s.title()}")
print(f"capitalize(): {s.capitalize()}")
print(f"swapcase(): {s.swapcase()}")

print(f"\nfind('World'):  {s.find('World')}")    # 7
print(f"find('xyz'):    {s.find('xyz')}")        # -1
print(f"index('World'): {s.index('World')}")     # 7
print(f"count('l'):     {s.count('l')}")         # 3
print(f"startswith('Hello'): {s.startswith('Hello')}")
print(f"endswith('!'):  {s.endswith('!')}")

print(f"\nreplace('World', 'Python'): {s.replace('World', 'Python')}")
print(f"center(20, '-'): {s.center(20, '-')}")
print(f"ljust(20, '.'): {s.ljust(20, '.')}")
print(f"rjust(20, '.'): {s.rjust(20, '.')}")
print(f"zfill(20): {'42'.zfill(8)}")

# ===== SPLIT & JOIN =====
print("\n--- Split & Join ---")
csv_line = "apple,banana,cherry,date"
parts = csv_line.split(",")
print(f"split(','): {parts}")

sentence = "  hello   world   python  "
words = sentence.split()     # splits on any whitespace
print(f"split(): {words}")

print(f"'-'.join(parts): {'-'.join(parts)}")
print(f"' '.join(words): {' '.join(words)}")

# splitlines
text = "line1\nline2\nline3"
print(f"splitlines(): {text.splitlines()}")

# partition
url = "https://example.com/path"
scheme, sep, rest = url.partition("://")
print(f"partition('://'): {scheme!r}, {sep!r}, {rest!r}")

# ===== STRING TESTING =====
print("\n--- String Tests ---")
tests = ["hello", "HELLO", "Hello World", "123", "abc123",
         "  ", "", "hello_world"]

for t in tests:
    if t:
        print(f"  {t!r:15} alpha:{t.isalpha()} digit:{t.isdigit()} "
              f"alnum:{t.isalnum()} space:{t.isspace()}")

# ===== FORMATTING =====
print("\n--- String Formatting ---")

# f-strings (recommended)
name, age = "Emmanuel", 20
print(f"f-string: {name}, age {age}")

# Format spec
pi = 3.14159265
print(f"  2 decimals: {pi:.2f}")
print(f"  Width 10:   {pi:10.2f}")
print(f"  Percentage: {0.856:.1%}")
print(f"  Binary:     {42:08b}")
print(f"  Hex:        {255:#06x}")
print(f"  Comma:      {1234567:,}")
print(f"  Left align: {'hi':<10}|")
print(f"  Right:      {'hi':>10}|")
print(f"  Center:     {'hi':^10}|")

# .format() method
print("\n.format(): {} is {} years old".format(name, age))
print(".format(): {n} is {a}".format(n=name, a=age))

# % formatting (old style)
print("%% format: %s is %d years old" % (name, age))

# ===== SLICING TRICKS =====
print("\n--- Slicing Tricks ---")
s = "Hello, World!"

print(f"Reverse: {s[::-1]}")
print(f"Every 2nd: {s[::2]}")
print(f"Last 6: {s[-6:]}")

# Check palindrome
word = "racecar"
is_palindrome = word == word[::-1]
print(f"'{word}' is palindrome: {is_palindrome}")

# ===== REGEX BASICS =====
print("\n--- Regex Basics ---")

text = "Contact us at support@example.com or sales@company.org"
emails = re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', text)
print(f"Emails found: {emails}")

# Match / Search
pattern = r'\d{3}-\d{4}'
phone = "Call 555-1234 or 555-5678"
matches = re.findall(pattern, phone)
print(f"Phone numbers: {matches}")

# Substitution
censored = re.sub(r'\d', '*', "SSN: 123-45-6789")
print(f"Censored: {censored}")

# Split on pattern
parts = re.split(r'[,;\s]+', "apple, banana; cherry  date")
print(f"Split on delimiters: {parts}")

# Groups
match = re.match(r'(\w+)\s(\w+)', "John Doe")
if match:
    print(f"Full: {match.group()}, First: {match.group(1)}, Last: {match.group(2)}")

# Named groups
pattern = r'(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})'
match = re.match(pattern, "2026-04-20")
if match:
    print(f"Year: {match.group('year')}, Month: {match.group('month')}, Day: {match.group('day')}")

# ===== STRING ENCODING =====
print("\n--- Encoding ---")
text = "Hello 🌍"
encoded = text.encode('utf-8')
decoded = encoded.decode('utf-8')
print(f"Original: {text}")
print(f"Encoded: {encoded}")
print(f"Decoded: {decoded}")
print(f"Bytes length: {len(encoded)}, String length: {len(text)}")
