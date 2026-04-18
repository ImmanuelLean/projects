/**
 * LESSON: Recursion
 * A method that calls itself. Every recursive method needs a BASE CASE to stop.
 */
public class Recursion {
    public static void main(String[] args) {
        // Factorial: 5! = 5 × 4 × 3 × 2 × 1 = 120
        System.out.println("--- Factorial ---");
        for (int i = 0; i <= 7; i++) {
            System.out.println(i + "! = " + factorial(i));
        }

        // Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, 21...
        System.out.println("\n--- Fibonacci ---");
        System.out.print("First 10 Fibonacci numbers: ");
        for (int i = 0; i < 10; i++) {
            System.out.print(fibonacci(i) + " ");
        }
        System.out.println();

        // Sum of digits: 1234 -> 1 + 2 + 3 + 4 = 10
        System.out.println("\n--- Sum of Digits ---");
        System.out.println("Sum of digits of 1234: " + sumOfDigits(1234));
        System.out.println("Sum of digits of 9876: " + sumOfDigits(9876));

        // Power: 2^10 = 1024
        System.out.println("\n--- Power ---");
        System.out.println("2^10 = " + power(2, 10));
        System.out.println("3^4 = " + power(3, 4));
    }

    // Factorial: n! = n × (n-1)!
    static long factorial(int n) {
        if (n <= 1) return 1; // base case
        return n * factorial(n - 1); // recursive case
    }

    // Fibonacci: F(n) = F(n-1) + F(n-2)
    static int fibonacci(int n) {
        if (n <= 0) return 0; // base case
        if (n == 1) return 1; // base case
        return fibonacci(n - 1) + fibonacci(n - 2); // recursive case
    }

    // Sum of digits
    static int sumOfDigits(int n) {
        if (n == 0) return 0; // base case
        return (n % 10) + sumOfDigits(n / 10);
    }

    // Power: base^exponent
    static long power(int base, int exponent) {
        if (exponent == 0) return 1; // base case
        return base * power(base, exponent - 1);
    }
}
