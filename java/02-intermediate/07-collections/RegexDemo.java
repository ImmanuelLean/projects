import java.util.regex.*;

/**
 * LESSON: Regular Expressions (Regex)
 * Regex defines search patterns for matching, finding, and replacing text.
 *
 * Key classes: Pattern (compiled regex), Matcher (performs matching)
 *
 * Common patterns:
 *   .       any character          \d      digit [0-9]
 *   *       0 or more              \w      word char [a-zA-Z0-9_]
 *   +       1 or more              \s      whitespace
 *   ?       0 or 1                 \D      non-digit
 *   {n}     exactly n              \W      non-word char
 *   {n,m}   n to m times           ^       start of string
 *   [abc]   a, b, or c             $       end of string
 *   [^abc]  NOT a, b, or c         |       OR
 *   (...)   capture group           (?:...) non-capturing group
 */
public class RegexDemo {
    public static void main(String[] args) {
        // ===== BASIC MATCHING =====
        System.out.println("--- Basic Matching ---");
        System.out.println("matches digit: " + "5".matches("\\d"));           // true
        System.out.println("matches word: " + "hello".matches("\\w+"));       // true
        System.out.println("matches email-like: " +
            "test@mail.com".matches("[\\w.]+@[\\w.]+\\.[a-z]+")); // true

        // ===== PATTERN & MATCHER =====
        System.out.println("\n--- Pattern & Matcher ---");
        String text = "My phone numbers are 123-456-7890 and 098-765-4321.";
        Pattern phonePattern = Pattern.compile("\\d{3}-\\d{3}-\\d{4}");
        Matcher matcher = phonePattern.matcher(text);

        System.out.println("Text: " + text);
        while (matcher.find()) {
            System.out.println("Found: " + matcher.group() + " at index " + matcher.start());
        }

        // ===== COMMON VALIDATIONS =====
        System.out.println("\n--- Email Validation ---");
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        String[] emails = {"user@example.com", "invalid@", "test.user@mail.co.uk", "@bad.com"};
        for (String email : emails) {
            System.out.printf("  %-25s -> %s%n", email, email.matches(emailRegex) ? "VALID" : "INVALID");
        }

        System.out.println("\n--- Password Validation ---");
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
        String passRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        String[] passwords = {"Str0ng@Pass", "weakpass", "NoDigit!", "Short1!"};
        for (String pass : passwords) {
            System.out.printf("  %-15s -> %s%n", pass, pass.matches(passRegex) ? "STRONG" : "WEAK");
        }

        // ===== CAPTURE GROUPS =====
        System.out.println("\n--- Capture Groups ---");
        String dateText = "Today is 2024-03-15 and tomorrow is 2024-03-16.";
        Pattern datePattern = Pattern.compile("(\\d{4})-(\\d{2})-(\\d{2})");
        Matcher dateMatcher = datePattern.matcher(dateText);

        while (dateMatcher.find()) {
            System.out.println("Full match: " + dateMatcher.group(0));
            System.out.println("  Year: " + dateMatcher.group(1));
            System.out.println("  Month: " + dateMatcher.group(2));
            System.out.println("  Day: " + dateMatcher.group(3));
        }

        // ===== STRING METHODS WITH REGEX =====
        System.out.println("\n--- String Methods with Regex ---");

        // split
        String csv = "one, two,  three ,four";
        String[] parts = csv.split("\\s*,\\s*"); // split on comma with optional spaces
        for (String part : parts) {
            System.out.println("  '" + part + "'");
        }

        // replaceAll
        String cleaned = "Hello   World   Java".replaceAll("\\s+", " ");
        System.out.println("Cleaned: '" + cleaned + "'");

        // Replace digits with #
        String masked = "Card: 4532-1234-5678-9012".replaceAll("\\d", "#");
        System.out.println("Masked: " + masked);

        // ===== CASE INSENSITIVE =====
        System.out.println("\n--- Case Insensitive ---");
        Pattern caseInsensitive = Pattern.compile("java", Pattern.CASE_INSENSITIVE);
        Matcher ciMatcher = caseInsensitive.matcher("I love Java and JAVA and java!");
        while (ciMatcher.find()) {
            System.out.println("Found '" + ciMatcher.group() + "' at " + ciMatcher.start());
        }
    }
}
