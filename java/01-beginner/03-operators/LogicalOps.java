/**
 * LESSON: Logical and Comparison Operators
 * Used for making decisions and comparisons.
 */
public class LogicalOps {
    public static void main(String[] args) {
        // ===== COMPARISON OPERATORS =====
        int a = 10, b = 20;
        System.out.println("a = " + a + ", b = " + b);
        System.out.println("a == b : " + (a == b));  // Equal to: false
        System.out.println("a != b : " + (a != b));  // Not equal: true
        System.out.println("a > b  : " + (a > b));   // Greater than: false
        System.out.println("a < b  : " + (a < b));   // Less than: true
        System.out.println("a >= b : " + (a >= b));   // Greater or equal: false
        System.out.println("a <= b : " + (a <= b));   // Less or equal: true

        // ===== LOGICAL OPERATORS =====
        boolean x = true, y = false;
        System.out.println("\n--- Logical Operators ---");
        System.out.println("x = " + x + ", y = " + y);
        System.out.println("x && y : " + (x && y));  // AND: both must be true -> false
        System.out.println("x || y : " + (x || y));  // OR: at least one true -> true
        System.out.println("!x     : " + (!x));      // NOT: flips the value -> false
        System.out.println("!y     : " + (!y));       // true

        // Short-circuit evaluation: Java stops checking if result is already known
        // && stops at first false, || stops at first true
        int num = 0;
        // This won't throw division by zero because && short-circuits
        if (num != 0 && (10 / num > 2)) {
            System.out.println("This won't print");
        }
        System.out.println("Short-circuit prevented division by zero!");

        // ===== BITWISE OPERATORS =====
        int p = 5;  // binary: 0101
        int q = 3;  // binary: 0011
        System.out.println("\n--- Bitwise Operators ---");
        System.out.println("p = " + p + " (0101), q = " + q + " (0011)");
        System.out.println("p & q  = " + (p & q));   // AND: 0001 = 1
        System.out.println("p | q  = " + (p | q));   // OR:  0111 = 7
        System.out.println("p ^ q  = " + (p ^ q));   // XOR: 0110 = 6
    }
}
