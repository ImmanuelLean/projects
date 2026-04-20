"""
LESSON: Dictionaries and Sets
Dict methods, defaultdict, Counter, sets, frozensets.

Run: python3 dicts_sets.py
"""
from collections import defaultdict, Counter, OrderedDict

# ===== DICT CREATION =====
print("--- Dict Creation ---")
empty = {}
person = {"name": "Emmanuel", "age": 20, "lang": "Python"}
from_pairs = dict([("a", 1), ("b", 2), ("c", 3)])
from_keys = dict.fromkeys(["x", "y", "z"], 0)

print(f"person: {person}")
print(f"from_pairs: {from_pairs}")
print(f"from_keys: {from_keys}")

# ===== ACCESSING VALUES =====
print("\n--- Accessing ---")
print(f"person['name']: {person['name']}")
print(f"person.get('age'): {person.get('age')}")
print(f"person.get('email', 'N/A'): {person.get('email', 'N/A')}")

# ===== MODIFYING =====
print("\n--- Modifying ---")
person["email"] = "emmanuel@example.com"  # add
person["age"] = 21                        # update
print(f"After add/update: {person}")

# setdefault: add only if key doesn't exist
person.setdefault("lang", "JavaScript")  # won't change
person.setdefault("city", "Lagos")       # will add
print(f"After setdefault: {person}")

# Update from another dict
person.update({"age": 22, "gpa": 3.8})
print(f"After update: {person}")

# Merge (Python 3.9+)
defaults = {"theme": "dark", "lang": "en"}
overrides = {"lang": "fr", "font": "mono"}
merged = defaults | overrides
print(f"Merged (|): {merged}")

# ===== REMOVING =====
print("\n--- Removing ---")
removed_val = person.pop("gpa")
print(f"pop('gpa'): {removed_val}")

last = person.popitem()
print(f"popitem(): {last}")

# ===== ITERATING =====
print("\n--- Iterating ---")
scores = {"Alice": 95, "Bob": 87, "Charlie": 92}

print("Keys:")
for k in scores:
    print(f"  {k}")

print("Values:")
for v in scores.values():
    print(f"  {v}")

print("Items:")
for k, v in scores.items():
    print(f"  {k}: {v}")

# ===== DICT METHODS =====
print("\n--- Useful Methods ---")
print(f"keys: {list(scores.keys())}")
print(f"values: {list(scores.values())}")
print(f"items: {list(scores.items())}")
print(f"'Alice' in scores: {'Alice' in scores}")
print(f"len(scores): {len(scores)}")

# ===== DEFAULTDICT =====
print("\n--- defaultdict ---")

# Group words by first letter
words = ["apple", "avocado", "banana", "blueberry", "cherry", "cranberry"]
by_letter = defaultdict(list)
for word in words:
    by_letter[word[0]].append(word)

for letter, group in sorted(by_letter.items()):
    print(f"  {letter}: {group}")

# Count with defaultdict
word_count = defaultdict(int)
for word in "the cat sat on the mat the cat".split():
    word_count[word] += 1
print(f"\nWord count: {dict(word_count)}")

# ===== COUNTER =====
print("\n--- Counter ---")
text = "abracadabra"
counts = Counter(text)
print(f"Counter('{text}'): {counts}")
print(f"Most common 3: {counts.most_common(3)}")
print(f"counts['a']: {counts['a']}")

# Counter arithmetic
c1 = Counter("aabbc")
c2 = Counter("abbcd")
print(f"\nc1 = {c1}")
print(f"c2 = {c2}")
print(f"c1 + c2 = {c1 + c2}")
print(f"c1 - c2 = {c1 - c2}")
print(f"c1 & c2 = {c1 & c2}")  # min of each
print(f"c1 | c2 = {c1 | c2}")  # max of each

# ===== SETS =====
print("\n--- Sets ---")
empty_set = set()        # NOT {} — that's a dict!
nums = {1, 2, 3, 4, 5}
from_list = set([1, 2, 2, 3, 3, 3])

print(f"nums: {nums}")
print(f"from_list (deduped): {from_list}")

# ===== SET OPERATIONS =====
print("\n--- Set Operations ---")
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

print(f"a = {a}")
print(f"b = {b}")
print(f"a | b (union):        {a | b}")
print(f"a & b (intersection): {a & b}")
print(f"a - b (difference):   {a - b}")
print(f"b - a (difference):   {b - a}")
print(f"a ^ b (symmetric):    {a ^ b}")

print(f"\na.issubset(b): {a.issubset(b)}")
print(f"{{4,5}}.issubset(a): {{4, 5}}.issubset(a) = { {4,5}.issubset(a) }")
print(f"a.isdisjoint({{10,20}}): {a.isdisjoint({10, 20})}")

# ===== SET METHODS =====
print("\n--- Set Methods ---")
s = {1, 2, 3}
s.add(4)
print(f"add(4): {s}")

s.discard(2)  # no error if missing
print(f"discard(2): {s}")

s.update({5, 6, 7})
print(f"update({{5,6,7}}): {s}")

popped = s.pop()
print(f"pop(): removed {popped}, set: {s}")

# ===== PRACTICAL: DEDUPLICATION =====
print("\n--- Practical: Deduplication ---")
emails = ["a@b.com", "c@d.com", "a@b.com", "e@f.com", "c@d.com"]
unique = list(set(emails))
print(f"Unique emails: {unique}")

# Preserve order
seen = set()
unique_ordered = []
for email in emails:
    if email not in seen:
        seen.add(email)
        unique_ordered.append(email)
print(f"Ordered unique: {unique_ordered}")

# Or use dict.fromkeys (Python 3.7+ preserves order)
unique_ordered2 = list(dict.fromkeys(emails))
print(f"dict.fromkeys: {unique_ordered2}")

# ===== FROZENSET =====
print("\n--- Frozenset (Immutable Set) ---")
fs = frozenset([1, 2, 3])
print(f"frozenset: {fs}")
# fs.add(4)  # ERROR: immutable

# Can use as dict key or set element
groups = {frozenset({1, 2}): "group A", frozenset({3, 4}): "group B"}
print(f"groups: {groups}")
