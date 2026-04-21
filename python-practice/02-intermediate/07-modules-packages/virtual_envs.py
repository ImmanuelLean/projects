"""
LESSON: Virtual Environments & Package Management
venv, pip, requirements.txt, pyproject.toml, dependency management.

Run: python3 virtual_envs.py
"""
import sys
import os
import subprocess
import sysconfig

# ===== WHAT IS A VIRTUAL ENVIRONMENT? =====
print("--- What is a Virtual Environment? ---")

print("  A virtual environment is an isolated Python installation")
print("  that has its own packages separate from the system Python.")
print("  This prevents dependency conflicts between projects.")

# ===== CURRENT PYTHON INFO =====
print("\n--- Current Python Environment ---")

print(f"  Python version: {sys.version}")
print(f"  Executable: {sys.executable}")
print(f"  Prefix: {sys.prefix}")
print(f"  In venv: {sys.prefix != sys.base_prefix}")
print(f"  Platform: {sys.platform}")

# ===== CREATING A VIRTUAL ENVIRONMENT =====
print("\n--- Creating a Virtual Environment ---")

print("""  # Create a virtual environment
  python3 -m venv myproject_env

  # Activate it (Linux/Mac)
  source myproject_env/bin/activate

  # Activate it (Windows)
  myproject_env\\Scripts\\activate

  # Deactivate
  deactivate

  # Delete (just remove the directory)
  rm -rf myproject_env""")

# ===== PIP ESSENTIALS =====
print("\n--- pip Essentials ---")

print("""  # Install a package
  pip install requests

  # Install specific version
  pip install requests==2.31.0

  # Install with version constraints
  pip install 'requests>=2.28,<3.0'

  # Upgrade a package
  pip install --upgrade requests

  # Uninstall
  pip uninstall requests

  # List installed packages
  pip list

  # Show package info
  pip show requests

  # Search for outdated packages
  pip list --outdated""")

# ===== REQUIREMENTS.TXT =====
print("\n--- requirements.txt ---")

print("""  # Freeze current environment
  pip freeze > requirements.txt

  # Install from requirements.txt
  pip install -r requirements.txt

  # Example requirements.txt:
  # requests==2.31.0
  # flask>=3.0,<4.0
  # numpy~=1.26.0       # compatible release (1.26.x)
  # pytest               # latest version
  # boto3; python_version>='3.8'  # conditional""")

# ===== VERSION SPECIFIERS =====
print("\n--- Version Specifiers ---")

print("""  ==2.31.0    Exact version
  >=2.28      Minimum version
  <3.0        Maximum (exclusive)
  >=2.28,<3.0 Range
  ~=1.26.0    Compatible release (>=1.26.0, <1.27.0)
  !=2.30.0    Exclude a version""")

# ===== PYPROJECT.TOML =====
print("\n--- pyproject.toml (Modern Standard) ---")

print("""  [project]
  name = "my-package"
  version = "1.0.0"
  description = "My awesome package"
  requires-python = ">=3.10"
  dependencies = [
      "requests>=2.28",
      "click>=8.0",
  ]

  [project.optional-dependencies]
  dev = [
      "pytest>=7.0",
      "black",
      "mypy",
  ]

  [build-system]
  requires = ["setuptools>=68.0"]
  build-backend = "setuptools.backends._legacy:_Backend"

  # Install with optional deps:
  # pip install -e '.[dev]'""")

# ===== INSTALLED PACKAGES =====
print("\n--- Currently Installed Packages ---")

# Using pkg_resources or importlib.metadata
try:
    from importlib.metadata import distributions
    installed = sorted(
        [(d.metadata["Name"], d.metadata["Version"])
         for d in distributions()],
        key=lambda x: x[0].lower()
    )
    print(f"  Total packages: {len(installed)}")
    for name, version in installed[:10]:
        print(f"    {name} == {version}")
    if len(installed) > 10:
        print(f"    ... and {len(installed) - 10} more")
except ImportError:
    print("  importlib.metadata not available")

# ===== SITE PACKAGES LOCATION =====
print("\n--- Site Packages Location ---")

site_packages = sysconfig.get_path("purelib")
print(f"  Site packages: {site_packages}")

# ===== BEST PRACTICES =====
print("\n--- Best Practices ---")

print("""  1. Always use a virtual environment per project
  2. Never install packages globally with pip
  3. Pin exact versions in production (pip freeze)
  4. Use loose versions in library setup (>=2.28)
  5. Keep requirements.txt in version control
  6. Use pyproject.toml for new projects
  7. Separate dev and production dependencies
  8. Consider using 'pip-tools' for dependency resolution
  9. Use 'python -m pip' instead of bare 'pip'""")

# ===== COMMON TOOLS =====
print("\n--- Package Management Tools ---")

print("""  pip         — Standard package installer
  pip-tools   — Pin and compile dependencies
  poetry      — Dependency management + packaging
  pdm         — PEP 582 based package manager
  uv          — Fast pip replacement (Rust-based)
  conda       — Cross-language package manager
  pipx        — Install CLI tools in isolation""")

# ===== PRACTICAL: CHECK ENVIRONMENT =====
print("\n--- Environment Health Check ---")

checks = {
    "Python 3.10+": sys.version_info >= (3, 10),
    "In virtual env": sys.prefix != sys.base_prefix,
    "pip available": bool(importlib.util.find_spec("pip")),
}

import importlib.util
for check, passed in checks.items():
    status = "✅" if passed else "❌"
    print(f"  {status} {check}")
