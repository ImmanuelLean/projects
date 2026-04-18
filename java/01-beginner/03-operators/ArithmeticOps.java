/**
 * LESSON: Arithmetic Operators
 * Basic math operations in Java.
 */
public class ArithmeticOps {
    public static void main(String[] args) {
        int a = 17, b = 5;

        // Basic arithmetic
        System.out.println("a = " + a + ", b = " + b);
        System.out.println("a + b = " + (a + b));   // Addition: 22
        System.out.println("a - b = " + (a - b));   // Subtraction: 12
        System.out.println("a * b = " + (a * b));   // Multiplication: 85
        System.out.println("a / b = " + (a / b));   // Integer division: 3 (no decimals!)
        System.out.println("a % b = " + (a % b));   // Modulus (remainder): 2

        // To get decimal division, at least one operand must be double
        System.out.println("a / (double)b = " + (a / (double) b)); // 3.4

        // ===== INCREMENT & DECREMENT =====
        int x = 10;
        System.out.println("\n--- Increment/Decrement ---");
        System.out.println("x = " + x);
        System.out.println("x++ = " + x++);  // Post-increment: prints 10, THEN x becomes 11
        System.out.println("x is now: " + x); // 11
        System.out.println("++x = " + (++x)); // Pre-increment: x becomes 12, THEN prints 12
        System.out.println("x-- = " + x--);  // Post-decrement: prints 12, THEN x becomes 11
        System.out.println("--x = " + (--x)); // Pre-decrement: x becomes 10, THEN prints 10

        // ===== COMPOUND ASSIGNMENT =====
        int score = 100;
        System.out.println("\n--- Compound Assignment ---");
        score += 10;  // score = score + 10
        System.out.println("score += 10 -> " + score);  // 110
        score -= 20;  // score = score - 20
        System.out.println("score -= 20 -> " + score);  // 90
        score *= 2;   // score = score * 2
        System.out.println("score *= 2  -> " + score);  // 180
        score /= 3;   // score = score / 3
        System.out.println("score /= 3  -> " + score);  // 60
        score %= 7;   // score = score % 7
        System.out.println("score %%= 7  -> " + score); // 4
    }
}
