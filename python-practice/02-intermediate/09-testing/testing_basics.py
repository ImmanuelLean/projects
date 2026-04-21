"""
LESSON: Testing Basics
assert, unittest, pytest patterns, fixtures, mocking, TDD.

Run: python3 testing_basics.py
"""
import unittest
from unittest.mock import Mock, patch, MagicMock
from io import StringIO

# ===== CODE UNDER TEST =====

class Calculator:
    """Simple calculator for demonstration."""

    def add(self, a: float, b: float) -> float:
        return a + b

    def divide(self, a: float, b: float) -> float:
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b

    def average(self, numbers: list[float]) -> float:
        if not numbers:
            raise ValueError("Cannot average empty list")
        return sum(numbers) / len(numbers)


def fetch_user_name(user_id: int) -> str:
    """Simulates fetching from an API."""
    import urllib.request
    response = urllib.request.urlopen(f"https://api.example.com/users/{user_id}")
    data = response.read()
    return data.decode()


class UserService:
    """Service that depends on external API."""

    def __init__(self, api_client):
        self.api = api_client

    def get_greeting(self, user_id: int) -> str:
        name = self.api.get_name(user_id)
        return f"Hello, {name}!"

    def get_user_count(self) -> int:
        users = self.api.list_users()
        return len(users)


# ===== BASIC ASSERTIONS =====
print("--- Basic Assertions ---")

# Python's built-in assert statement
calc = Calculator()

assert calc.add(2, 3) == 5, "2 + 3 should equal 5"
assert calc.add(-1, 1) == 0, "-1 + 1 should equal 0"
assert calc.add(0.1, 0.2) - 0.3 < 1e-9, "Float precision"

print("  All basic assertions passed ✅")

# ===== UNITTEST FRAMEWORK =====
print("\n--- unittest Framework ---")


class TestCalculator(unittest.TestCase):
    """Unit tests for Calculator class."""

    def setUp(self):
        """Runs before each test method."""
        self.calc = Calculator()

    def tearDown(self):
        """Runs after each test method."""
        pass  # cleanup if needed

    # --- Test methods must start with 'test_' ---

    def test_add_positive(self):
        self.assertEqual(self.calc.add(2, 3), 5)

    def test_add_negative(self):
        self.assertEqual(self.calc.add(-1, -1), -2)

    def test_add_zero(self):
        self.assertEqual(self.calc.add(0, 0), 0)

    def test_divide_normal(self):
        self.assertAlmostEqual(self.calc.divide(10, 3), 3.333, places=3)

    def test_divide_by_zero(self):
        with self.assertRaises(ValueError) as ctx:
            self.calc.divide(10, 0)
        self.assertIn("zero", str(ctx.exception))

    def test_average(self):
        self.assertEqual(self.calc.average([10, 20, 30]), 20.0)

    def test_average_empty(self):
        with self.assertRaises(ValueError):
            self.calc.average([])

    # --- Assertion methods ---
    def test_assertion_methods(self):
        """Demonstrates various assertion methods."""
        self.assertTrue(True)
        self.assertFalse(False)
        self.assertIsNone(None)
        self.assertIsNotNone("something")
        self.assertIn(3, [1, 2, 3])
        self.assertNotIn(4, [1, 2, 3])
        self.assertIsInstance(self.calc, Calculator)
        self.assertGreater(5, 3)
        self.assertLessEqual(3, 3)


# ===== MOCKING =====
print("\n--- Mocking ---")


class TestUserService(unittest.TestCase):
    """Tests using Mock objects."""

    def test_get_greeting(self):
        # Create a mock API client
        mock_api = Mock()
        mock_api.get_name.return_value = "Alice"

        service = UserService(mock_api)
        result = service.get_greeting(1)

        self.assertEqual(result, "Hello, Alice!")
        mock_api.get_name.assert_called_once_with(1)

    def test_get_user_count(self):
        mock_api = Mock()
        mock_api.list_users.return_value = ["Alice", "Bob", "Charlie"]

        service = UserService(mock_api)
        count = service.get_user_count()

        self.assertEqual(count, 3)
        mock_api.list_users.assert_called_once()

    def test_mock_side_effect(self):
        """Mock can raise exceptions."""
        mock_api = Mock()
        mock_api.get_name.side_effect = ConnectionError("API down")

        service = UserService(mock_api)
        with self.assertRaises(ConnectionError):
            service.get_greeting(1)

    def test_mock_multiple_returns(self):
        """Mock can return different values on successive calls."""
        mock_api = Mock()
        mock_api.get_name.side_effect = ["Alice", "Bob", "Charlie"]

        service = UserService(mock_api)
        self.assertEqual(service.get_greeting(1), "Hello, Alice!")
        self.assertEqual(service.get_greeting(2), "Hello, Bob!")
        self.assertEqual(service.get_greeting(3), "Hello, Charlie!")


# ===== PATCH DECORATOR =====
print("\n--- patch() Decorator ---")


class TestWithPatch(unittest.TestCase):
    """Using patch to mock module-level functions."""

    @patch('builtins.open', create=True)
    def test_file_reading(self, mock_open):
        mock_open.return_value.__enter__ = Mock(
            return_value=StringIO("file content")
        )
        mock_open.return_value.__exit__ = Mock(return_value=False)

        with open("fake_file.txt") as f:
            content = f.read()

        self.assertEqual(content, "file content")


# ===== TEST PATTERNS =====
print("\n--- Test Patterns ---")


class TestPatterns(unittest.TestCase):
    """Common testing patterns."""

    # Parameterized-style testing (without pytest)
    def test_add_cases(self):
        """Test multiple cases in one test."""
        cases = [
            (1, 1, 2),
            (0, 0, 0),
            (-1, 1, 0),
            (100, 200, 300),
            (0.1, 0.2, 0.3),
        ]
        calc = Calculator()
        for a, b, expected in cases:
            with self.subTest(a=a, b=b):
                result = calc.add(a, b)
                self.assertAlmostEqual(result, expected, places=10)

    def test_exception_message(self):
        """Test exact exception message."""
        calc = Calculator()
        with self.assertRaises(ValueError) as ctx:
            calc.divide(1, 0)
        self.assertEqual(str(ctx.exception), "Cannot divide by zero")


# ===== RUN TESTS =====
print("\n--- Running Tests ---")

# Create a test suite and run it
loader = unittest.TestLoader()
suite = unittest.TestSuite()

# Add test classes
suite.addTests(loader.loadTestsFromTestCase(TestCalculator))
suite.addTests(loader.loadTestsFromTestCase(TestUserService))
suite.addTests(loader.loadTestsFromTestCase(TestWithPatch))
suite.addTests(loader.loadTestsFromTestCase(TestPatterns))

# Run with verbosity
runner = unittest.TextTestRunner(verbosity=2, stream=StringIO())
result = runner.run(suite)

print(f"\n  Tests run: {result.testsRun}")
print(f"  Failures: {len(result.failures)}")
print(f"  Errors: {len(result.errors)}")
print(f"  Success: {result.wasSuccessful()} ✅")

# ===== PYTEST PATTERNS (Reference) =====
print("\n--- pytest Patterns (Reference) ---")

print("""  # pytest is the preferred testing framework
  # Install: pip install pytest

  # test_calculator.py
  import pytest

  def test_add():
      calc = Calculator()
      assert calc.add(2, 3) == 5

  @pytest.fixture
  def calc():
      return Calculator()

  def test_divide(calc):
      assert calc.divide(10, 2) == 5.0

  def test_divide_zero(calc):
      with pytest.raises(ValueError, match="zero"):
          calc.divide(1, 0)

  @pytest.mark.parametrize("a,b,expected", [
      (1, 1, 2),
      (0, 0, 0),
      (-1, 1, 0),
  ])
  def test_add_params(calc, a, b, expected):
      assert calc.add(a, b) == expected

  # Run: pytest -v
  # Run with coverage: pytest --cov=mymodule""")

# ===== BEST PRACTICES =====
print("\n--- Testing Best Practices ---")

print("""  1. Test one thing per test (single assertion concept)
  2. Use descriptive test names: test_divide_by_zero_raises_error
  3. Follow AAA pattern: Arrange, Act, Assert
  4. Mock external dependencies (APIs, databases, files)
  5. Test edge cases: empty inputs, None, boundaries
  6. Keep tests fast and independent
  7. Use fixtures for shared setup
  8. Aim for high coverage but test behavior, not lines""")
