/**
 * LESSON: String Methods
 * Strings are immutable objects - methods return NEW strings.
 */
public class StringBasics {
    public static void main(String[] args) {
        String text = "  Hello, World!  ";
        String name = "Emmanuel";

        // ===== BASIC PROPERTIES =====
        System.out.println("--- Basic ---");
        System.out.println("Length: " + name.length());               // 8
        System.out.println("charAt(0): " + name.charAt(0));          // E
        System.out.println("isEmpty: " + name.isEmpty());            // false
        System.out.println("\"\" isEmpty: " + "".isEmpty());         // true

        // ===== COMPARISON =====
        System.out.println("\n--- Comparison ---");
        System.out.println("equals: " + name.equals("Emmanuel"));              // true
        System.out.println("equals: " + name.equals("emmanuel"));              // false
        System.out.println("equalsIgnoreCase: " + name.equalsIgnoreCase("EMMANUEL")); // true
        System.out.println("compareTo 'A': " + name.compareTo("Alpha"));      // positive (E > A)

        // ===== SEARCHING =====
        System.out.println("\n--- Searching ---");
        System.out.println("contains 'man': " + name.contains("man"));        // true
        System.out.println("indexOf 'a': " + name.indexOf('a'));               // 3
        System.out.println("lastIndexOf 'e': " + name.lastIndexOf('e'));       // 7 (not found = -1)
        System.out.println("startsWith 'Em': " + name.startsWith("Em"));      // true
        System.out.println("endsWith 'el': " + name.endsWith("el"));          // true

        // ===== EXTRACTING =====
        System.out.println("\n--- Extracting ---");
        System.out.println("substring(0, 4): " + name.substring(0, 4));       // Emma
        System.out.println("substring(4): " + name.substring(4));             // nuel

        // ===== MODIFYING (returns new string) =====
        System.out.println("\n--- Modifying ---");
        System.out.println("toUpperCase: " + name.toUpperCase());             // EMMANUEL
        System.out.println("toLowerCase: " + name.toLowerCase());             // emmanuel
        System.out.println("trim: '" + text.trim() + "'");                    // 'Hello, World!'
        System.out.println("replace: " + name.replace('a', '@'));             // Emm@nuel
        System.out.println("replace: " + name.replace("man", "MAN"));        // EmMANuel
        System.out.println("concat: " + name.concat(" Coder"));              // Emmanuel Coder

        // ===== SPLITTING AND JOINING =====
        System.out.println("\n--- Split and Join ---");
        String csv = "apple,banana,cherry,mango";
        String[] parts = csv.split(",");
        for (String part : parts) {
            System.out.println("  - " + part);
        }
        String joined = String.join(" | ", parts);
        System.out.println("Joined: " + joined);

        // ===== CHAR ARRAY =====
        System.out.println("\n--- Char Array ---");
        char[] chars = name.toCharArray();
        for (char c : chars) {
            System.out.print(c + " ");
        }
        System.out.println();

        // ===== STRING FORMATTING =====
        System.out.println("\n--- Formatting ---");
        String formatted = String.format("Name: %s, Age: %d, GPA: %.2f", "Emmanuel", 20, 3.75);
        System.out.println(formatted);
    }
}
