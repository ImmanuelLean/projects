import java.util.Scanner;

/**
 * LESSON: User Input with Scanner
 * Scanner reads input from the keyboard (System.in).
 */
public class UserInput {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // ===== READING DIFFERENT TYPES =====
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();  // reads entire line

        System.out.print("Enter your age: ");
        int age = scanner.nextInt();       // reads an integer

        System.out.print("Enter your GPA: ");
        double gpa = scanner.nextDouble(); // reads a double

        // IMPORTANT: After nextInt/nextDouble, call nextLine() to consume leftover newline
        scanner.nextLine(); // consume the leftover newline

        System.out.print("Enter your city: ");
        String city = scanner.nextLine();

        System.out.print("Are you a student? (true/false): ");
        boolean isStudent = scanner.nextBoolean();

        // Display results
        System.out.println("\n===== Your Info =====");
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("GPA: " + gpa);
        System.out.println("City: " + city);
        System.out.println("Student: " + isStudent);

        // ===== READING WORD BY WORD =====
        scanner.nextLine(); // consume newline
        System.out.print("\nEnter a sentence: ");
        String firstWord = scanner.next();  // reads only first word (stops at space)
        System.out.println("First word: " + firstWord);

        // Always close the scanner when done
        scanner.close();
    }
}
