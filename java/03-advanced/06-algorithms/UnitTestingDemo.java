import java.util.*;

/**
 * LESSON: Unit Testing Concepts
 *
 * In real projects you'd use JUnit 5 + Maven/Gradle. This file demonstrates
 * testing concepts with a mini test framework so you can run it standalone.
 *
 * JUnit 5 SETUP (for real projects):
 *   <!-- pom.xml -->
 *   <dependency>
 *       <groupId>org.junit.jupiter</groupId>
 *       <artifactId>junit-jupiter</artifactId>
 *       <version>5.10.0</version>
 *       <scope>test</scope>
 *   </dependency>
 *
 * JUnit 5 EXAMPLE:
 *   import org.junit.jupiter.api.*;
 *   import static org.junit.jupiter.api.Assertions.*;
 *
 *   class CalculatorTest {
 *       @Test void testAdd() { assertEquals(5, Calculator.add(2, 3)); }
 *       @Test void testDivideByZero() {
 *           assertThrows(ArithmeticException.class, () -> Calculator.divide(1, 0));
 *       }
 *   }
 */
public class UnitTestingDemo {
    static int passed = 0, failed = 0;

    public static void main(String[] args) {
        System.out.println("===== Unit Testing Demo =====\n");

        // ===== TESTING A CALCULATOR =====
        System.out.println("--- Calculator Tests ---");
        assertEquals(5, Calculator.add(2, 3), "add(2, 3) should be 5");
        assertEquals(0, Calculator.add(-1, 1), "add(-1, 1) should be 0");
        assertEquals(-5, Calculator.subtract(3, 8), "subtract(3, 8) should be -5");
        assertEquals(20, Calculator.multiply(4, 5), "multiply(4, 5) should be 20");
        assertEquals(3.0, Calculator.divide(9, 3), "divide(9, 3) should be 3.0");
        assertThrows(ArithmeticException.class, () -> Calculator.divide(1, 0),
            "divide by zero should throw ArithmeticException");

        // ===== TESTING A STRING UTILITY =====
        System.out.println("\n--- StringUtils Tests ---");
        assertEquals("dlrow olleh", StringUtils.reverse("hello world"), "reverse 'hello world'");
        assertEquals("", StringUtils.reverse(""), "reverse empty string");
        assertTrue(StringUtils.isPalindrome("racecar"), "'racecar' is palindrome");
        assertTrue(StringUtils.isPalindrome("Madam"), "'Madam' is palindrome (case insensitive)");
        assertFalse(StringUtils.isPalindrome("hello"), "'hello' is NOT palindrome");
        assertEquals(3, StringUtils.countVowels("hello"), "'hello' has 3 vowels? (actually 2)");
        assertEquals(2, StringUtils.countVowels("hello"), "'hello' has 2 vowels");

        // ===== TESTING EDGE CASES =====
        System.out.println("\n--- Edge Case Tests ---");
        assertNotNull(new ArrayList<>(), "new ArrayList should not be null");
        assertNull(null, "null should be null");
        assertEquals(0, Calculator.add(0, 0), "add(0, 0) should be 0");
        assertEquals(Integer.MAX_VALUE, Calculator.add(Integer.MAX_VALUE, 0),
            "add MAX_VALUE + 0");

        // ===== RESULTS =====
        System.out.printf("%n===== Results: %d passed, %d failed =====%n", passed, failed);
    }

    // ===== MINI ASSERTION FRAMEWORK =====

    static void assertEquals(Object expected, Object actual, String message) {
        if (Objects.equals(expected, actual)) {
            System.out.println("  ✓ PASS: " + message);
            passed++;
        } else {
            System.out.printf("  ✗ FAIL: %s (expected: %s, got: %s)%n", message, expected, actual);
            failed++;
        }
    }

    static void assertTrue(boolean condition, String message) {
        if (condition) {
            System.out.println("  ✓ PASS: " + message);
            passed++;
        } else {
            System.out.println("  ✗ FAIL: " + message + " (expected true)");
            failed++;
        }
    }

    static void assertFalse(boolean condition, String message) {
        assertTrue(!condition, message);
    }

    static void assertNull(Object obj, String message) {
        assertTrue(obj == null, message);
    }

    static void assertNotNull(Object obj, String message) {
        assertTrue(obj != null, message);
    }

    static void assertThrows(Class<? extends Exception> expected, Runnable code, String message) {
        try {
            code.run();
            System.out.println("  ✗ FAIL: " + message + " (no exception thrown)");
            failed++;
        } catch (Exception e) {
            if (expected.isInstance(e)) {
                System.out.println("  ✓ PASS: " + message);
                passed++;
            } else {
                System.out.printf("  ✗ FAIL: %s (expected %s, got %s)%n",
                    message, expected.getSimpleName(), e.getClass().getSimpleName());
                failed++;
            }
        }
    }
}

// ===== CLASSES TO TEST =====

class Calculator {
    static int add(int a, int b) { return a + b; }
    static int subtract(int a, int b) { return a - b; }
    static int multiply(int a, int b) { return a * b; }
    static double divide(int a, int b) {
        if (b == 0) throw new ArithmeticException("Cannot divide by zero");
        return (double) a / b;
    }
}

class StringUtils {
    static String reverse(String s) {
        return new StringBuilder(s).reverse().toString();
    }

    static boolean isPalindrome(String s) {
        String cleaned = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        return cleaned.equals(new StringBuilder(cleaned).reverse().toString());
    }

    static int countVowels(String s) {
        int count = 0;
        for (char c : s.toLowerCase().toCharArray()) {
            if ("aeiou".indexOf(c) != -1) count++;
        }
        return count;
    }
}
