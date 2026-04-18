/**
 * LESSON: If-Else Statements
 * Control the flow of your program based on conditions.
 */
public class IfElse {
    public static void main(String[] args) {
        // ===== BASIC IF =====
        int age = 18;
        if (age >= 18) {
            System.out.println("You are an adult.");
        }

        // ===== IF-ELSE =====
        int score = 45;
        if (score >= 50) {
            System.out.println("You passed!");
        } else {
            System.out.println("You failed. Score: " + score);
        }

        // ===== IF - ELSE IF - ELSE (Grade System) =====
        int mark = 78;
        System.out.println("\nMark: " + mark);
        if (mark >= 90) {
            System.out.println("Grade: A");
        } else if (mark >= 80) {
            System.out.println("Grade: B");
        } else if (mark >= 70) {
            System.out.println("Grade: C");
        } else if (mark >= 60) {
            System.out.println("Grade: D");
        } else {
            System.out.println("Grade: F");
        }

        // ===== NESTED IF =====
        boolean hasLicense = true;
        int driverAge = 20;
        System.out.println("\n--- Nested If ---");
        if (driverAge >= 18) {
            if (hasLicense) {
                System.out.println("You can drive!");
            } else {
                System.out.println("You need a license first.");
            }
        } else {
            System.out.println("Too young to drive.");
        }

        // ===== TERNARY OPERATOR =====
        // Shorthand: condition ? valueIfTrue : valueIfFalse
        int num = 15;
        String result = (num % 2 == 0) ? "Even" : "Odd";
        System.out.println("\n" + num + " is " + result);

        // Ternary to find max
        int a = 25, b = 30;
        int max = (a > b) ? a : b;
        System.out.println("Max of " + a + " and " + b + " is " + max);
    }
}
