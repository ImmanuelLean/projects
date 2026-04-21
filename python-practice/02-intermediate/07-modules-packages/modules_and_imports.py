"""
LESSON: Modules and Imports
import system, __name__, packages, relative imports, importlib, __all__.

Run: python3 modules_and_imports.py
"""
import sys
import os
import importlib
import math
from collections import Counter
from pathlib import Path

# ===== IMPORT STYLES =====
print("--- Import Styles ---")

# Style 1: import module
import json
data = json.dumps({"key": "value"})
print(f"  json.dumps: {data}")

# Style 2: from module import name
from datetime import datetime, timedelta
now = datetime.now()
print(f"  datetime.now: {now.strftime('%Y-%m-%d')}")

# Style 3: import with alias
import collections as col
counter = col.Counter("abracadabra")
print(f"  Counter: {counter.most_common(3)}")

# Style 4: from module import specific names
from os.path import join, exists
print(f"  join: {join('home', 'user', 'docs')}")

# ===== __name__ AND __main__ =====
print("\n--- __name__ ---")

print(f"  This module's __name__: {__name__}")
print(f"  math's __name__: {math.__name__}")

# The if __name__ == "__main__" pattern:
# When a file is run directly: __name__ == "__main__"
# When a file is imported: __name__ == "module_name"

def main():
    """Entry point when run as script."""
    print("  Running as main script")

# This is the standard pattern:
if __name__ == "__main__":
    # Only runs when executed directly, not when imported
    pass  # main() would go here

# ===== MODULE SEARCH PATH =====
print("\n--- Module Search Path ---")

print("  Python searches for modules in this order:")
for i, path in enumerate(sys.path[:5]):
    print(f"    {i}: {path}")
print(f"    ... ({len(sys.path)} total paths)")

# ===== MODULE ATTRIBUTES =====
print("\n--- Module Attributes ---")

print(f"  math.__name__: {math.__name__}")
print(f"  math.__file__: {getattr(math, '__file__', 'built-in')}")
print(f"  math.__doc__: {math.__doc__[:60]}...")

# dir() shows module contents
math_funcs = [x for x in dir(math) if not x.startswith('_')]
print(f"  math functions (first 10): {math_funcs[:10]}")

# ===== __all__ =====
print("\n--- __all__ (Export Control) ---")

# __all__ controls what `from module import *` exports
# Example of how a module might define it:
__all__ = ["public_func"]

def public_func():
    return "I'm public"

def _private_func():
    return "I'm private by convention"

# When someone does `from this_module import *`, only public_func is imported

print(f"  __all__ = {__all__}")
print(f"  public_func: {public_func()}")
print(f"  _private_func: {_private_func()}")  # still accessible directly

# ===== PACKAGE STRUCTURE =====
print("\n--- Package Structure ---")

# A Python package is a directory with __init__.py:
#
# mypackage/
#   __init__.py          ← makes it a package
#   module_a.py
#   module_b.py
#   subpackage/
#     __init__.py
#     module_c.py
#
# Imports:
#   import mypackage.module_a
#   from mypackage import module_b
#   from mypackage.subpackage import module_c

print("  Package = directory + __init__.py")
print("  __init__.py can be empty or contain initialization code")

# Namespace packages (PEP 420) — no __init__.py needed in Python 3.3+
print("  Namespace packages: no __init__.py needed (Python 3.3+)")

# ===== RELATIVE IMPORTS =====
print("\n--- Relative Imports ---")

# Inside a package, you can use relative imports:
#
# from . import sibling_module           # current package
# from .sibling import something         # from sibling module
# from .. import parent_module           # parent package
# from ..other_package import module     # sibling package
#
# NOTE: Relative imports only work inside packages, not in scripts

print("  from . import sibling        # same package")
print("  from .. import parent        # parent package")
print("  from .sub import func        # sub-module")

# ===== IMPORTLIB: DYNAMIC IMPORTS =====
print("\n--- Dynamic Imports with importlib ---")

# Import a module by string name
json_module = importlib.import_module("json")
result = json_module.loads('{"dynamic": true}')
print(f"  Dynamic import json: {result}")

# Reload a module (useful during development)
# importlib.reload(json_module)

# ===== CIRCULAR IMPORTS =====
print("\n--- Circular Import Solutions ---")

# Problem: module_a imports module_b, module_b imports module_a
# Solutions:
print("  1. Move imports inside functions (lazy import)")
print("  2. Restructure code to break the cycle")
print("  3. Use TYPE_CHECKING for type-hint-only imports")
print("  4. Move shared code to a third module")

# Example of lazy import:
def process_json_data(text: str):
    """Import inside function to avoid circular dependency."""
    import json  # local import
    return json.loads(text)

print(f"  Lazy import: {process_json_data('{\"lazy\": true}')}")

# TYPE_CHECKING pattern:
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    # These imports only happen during type checking, not at runtime
    from pathlib import PurePosixPath

# ===== SYS.MODULES CACHE =====
print("\n--- Module Cache ---")

# Python caches imported modules in sys.modules
print(f"  'math' in sys.modules: {'math' in sys.modules}")
print(f"  'json' in sys.modules: {'json' in sys.modules}")
print(f"  Total cached modules: {len(sys.modules)}")

# Importing again returns the cached version (same object)
import math as math2
print(f"  math is math2: {math is math2}")

# ===== PRACTICAL: PLUGIN SYSTEM =====
print("\n--- Mini Plugin System ---")

class PluginRegistry:
    """Simple plugin registry using dynamic imports."""

    def __init__(self):
        self._plugins = {}

    def register(self, name: str, plugin_class):
        self._plugins[name] = plugin_class
        print(f"  Registered plugin: {name}")

    def get(self, name: str):
        return self._plugins.get(name)

    def list_plugins(self):
        return list(self._plugins.keys())

# Register "plugins"
class JSONFormatter:
    def format(self, data):
        return json.dumps(data)

class CSVFormatter:
    def format(self, data):
        return ",".join(str(v) for v in data.values())

registry = PluginRegistry()
registry.register("json", JSONFormatter)
registry.register("csv", CSVFormatter)

# Use a plugin by name
formatter = registry.get("json")()
print(f"  JSON output: {formatter.format({'name': 'Alice', 'age': 30})}")
print(f"  Available: {registry.list_plugins()}")
