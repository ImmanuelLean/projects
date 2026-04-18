/**
 * LESSON: Varargs (Variable Arguments)
 * Allows a method to accept zero or more arguments of a specified type.
 * Syntax: methodName(Type... paramName) — treated as an array inside the method.
 */
public class VarargsDemo {
    public static void main(String[] args) {
        // ===== BASIC VARARGS =====
        System.out.println("--- Basic Varargs ---");
        System.out.println("Sum(): " + sum());           // 0 args
        System.out.println("Sum(5): " + sum(5));          // 1 arg
        System.out.println("Sum(1,2,3): " + sum(1, 2, 3)); // 3 args
        System.out.println("Sum(1,2,3,4,5): " + sum(1, 2, 3, 4, 5)); // 5 args

        // ===== VARARGS WITH OTHER PARAMETERS =====
        System.out.println("\n--- Mixed Parameters ---");
        printInfo("Emmanuel", 95, 88, 92, 78);
        printInfo("Alice", 100, 90);

        // ===== VARARGS WITH STRINGS =====
        System.out.println("\n--- String Varargs ---");
        String result = joinStrings("-", "Java", "Python", "C++", "Go");
        System.out.println("Joined: " + result);

        // ===== PASSING AN ARRAY TO VARARGS =====
        System.out.println("\n--- Array to Varargs ---");
        int[] numbers = {10, 20, 30, 40};
        System.out.println("Sum of array: " + sum(numbers)); // array works too!

        // ===== FINDING MIN/MAX =====
        System.out.println("\n--- Min/Max ---");
        System.out.println("Max(3,7,1,9,4): " + max(3, 7, 1, 9, 4));
        System.out.println("Min(3,7,1,9,4): " + min(3, 7, 1, 9, 4));
    }

    // Varargs: accepts 0 or more ints
    static int sum(int... numbers) {
        int total = 0;
        for (int n : numbers) { // treat as array
            total += n;
        }
        return total;
    }

    // Varargs MUST be the LAST parameter
    static void printInfo(String name, int... scores) {
        System.out.print(name + "'s scores: ");
        int total = 0;
        for (int score : scores) {
            System.out.print(score + " ");
            total += score;
        }
        double avg = scores.length > 0 ? (double) total / scores.length : 0;
        System.out.printf("(avg: %.1f)%n", avg);
    }

    static String joinStrings(String delimiter, String... parts) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < parts.length; i++) {
            sb.append(parts[i]);
            if (i < parts.length - 1) sb.append(delimiter);
        }
        return sb.toString();
    }

    static int max(int first, int... rest) {
        int result = first;
        for (int n : rest) {
            if (n > result) result = n;
        }
        return result;
    }

    static int min(int first, int... rest) {
        int result = first;
        for (int n : rest) {
            if (n < result) result = n;
        }
        return result;
    }
}
