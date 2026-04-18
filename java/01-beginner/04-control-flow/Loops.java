/**
 * LESSON: Loops in Java
 * Repeat blocks of code multiple times.
 */
public class Loops {
    public static void main(String[] args) {
        // ===== FOR LOOP =====
        // for (initialization; condition; update)
        System.out.println("--- For Loop ---");
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }

        // ===== WHILE LOOP =====
        // Repeats while condition is true (checks BEFORE each iteration)
        System.out.println("\n--- While Loop ---");
        int n = 5;
        while (n > 0) {
            System.out.println("Countdown: " + n);
            n--;
        }

        // ===== DO-WHILE LOOP =====
        // Executes at least ONCE, then checks condition
        System.out.println("\n--- Do-While Loop ---");
        int num = 1;
        do {
            System.out.println("Number: " + num);
            num++;
        } while (num <= 3);

        // ===== ENHANCED FOR-EACH LOOP =====
        System.out.println("\n--- For-Each Loop ---");
        String[] fruits = {"Apple", "Banana", "Cherry", "Mango"};
        for (String fruit : fruits) {
            System.out.println("Fruit: " + fruit);
        }

        // ===== NESTED LOOPS =====
        System.out.println("\n--- Nested Loops (Multiplication Table) ---");
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                System.out.printf("%d x %d = %d\t", i, j, i * j);
            }
            System.out.println();
        }

        // ===== BREAK =====
        // Exits the loop immediately
        System.out.println("\n--- Break ---");
        for (int i = 1; i <= 10; i++) {
            if (i == 5) {
                System.out.println("Breaking at " + i);
                break;
            }
            System.out.println("i = " + i);
        }

        // ===== CONTINUE =====
        // Skips current iteration, continues with next
        System.out.println("\n--- Continue (skip even numbers) ---");
        for (int i = 1; i <= 10; i++) {
            if (i % 2 == 0) continue; // skip even numbers
            System.out.println("Odd: " + i);
        }

        // ===== LABELED BREAK =====
        // Break out of outer loop from inner loop
        System.out.println("\n--- Labeled Break ---");
        outer:
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (i == 1 && j == 1) {
                    System.out.println("Breaking outer loop at i=" + i + ", j=" + j);
                    break outer;
                }
                System.out.println("i=" + i + ", j=" + j);
            }
        }
    }
}
