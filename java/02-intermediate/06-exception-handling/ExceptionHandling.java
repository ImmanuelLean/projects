import java.io.*;

/**
 * LESSON: Exception Handling
 * Exceptions are errors that occur during runtime.
 * Handle them gracefully instead of crashing.
 *
 * Checked exceptions   - must be handled (IOException, SQLException)
 * Unchecked exceptions  - optional to handle (NullPointerException, ArithmeticException)
 */
public class ExceptionHandling {
    public static void main(String[] args) {
        // ===== TRY-CATCH =====
        System.out.println("--- Basic Try-Catch ---");
        try {
            int result = 10 / 0; // ArithmeticException
            System.out.println(result); // never reached
        } catch (ArithmeticException e) {
            System.out.println("Error: " + e.getMessage());
        }

        // ===== MULTIPLE CATCH BLOCKS =====
        System.out.println("\n--- Multiple Catch ---");
        try {
            int[] arr = {1, 2, 3};
            System.out.println(arr[10]); // ArrayIndexOutOfBoundsException
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Array error: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("General error: " + e.getMessage());
        }

        // ===== TRY-CATCH-FINALLY =====
        System.out.println("\n--- Finally Block ---");
        try {
            int x = Integer.parseInt("abc"); // NumberFormatException
        } catch (NumberFormatException e) {
            System.out.println("Parse error: " + e.getMessage());
        } finally {
            // ALWAYS executes, even if exception occurs or not
            System.out.println("Finally block always runs!");
        }

        // ===== THROW KEYWORD =====
        System.out.println("\n--- Throw ---");
        try {
            validateAge(15);
        } catch (IllegalArgumentException e) {
            System.out.println("Validation error: " + e.getMessage());
        }

        // ===== CUSTOM EXCEPTION =====
        System.out.println("\n--- Custom Exception ---");
        try {
            withdraw(100, 500);
        } catch (InsufficientFundsException e) {
            System.out.println("Bank error: " + e.getMessage());
            System.out.println("Short by: $" + e.getShortage());
        }

        // ===== TRY-WITH-RESOURCES =====
        System.out.println("\n--- Try-With-Resources ---");
        // Automatically closes resources (anything implementing AutoCloseable)
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("test_output.txt"))) {
            writer.write("Hello from try-with-resources!");
            System.out.println("File written successfully");
        } catch (IOException e) {
            System.out.println("IO Error: " + e.getMessage());
        }
        // writer is automatically closed here, even if exception occurred
    }

    // 'throws' declares that this method might throw an exception
    static void validateAge(int age) {
        if (age < 18) {
            throw new IllegalArgumentException("Age must be 18+. Got: " + age);
        }
        System.out.println("Age is valid: " + age);
    }

    static void withdraw(double balance, double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(amount - balance);
        }
        System.out.println("Withdrawal successful. Remaining: $" + (balance - amount));
    }
}

// Custom exception class
class InsufficientFundsException extends Exception {
    private double shortage;

    InsufficientFundsException(double shortage) {
        super("Insufficient funds in account");
        this.shortage = shortage;
    }

    double getShortage() { return shortage; }
}
