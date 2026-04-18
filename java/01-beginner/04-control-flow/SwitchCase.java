/**
 * LESSON: Switch Statement
 * An alternative to long if-else chains when comparing one variable.
 */
public class SwitchCase {
    public static void main(String[] args) {
        // ===== TRADITIONAL SWITCH =====
        int day = 3;
        System.out.println("Day number: " + day);
        switch (day) {
            case 1:
                System.out.println("Monday");
                break;  // break prevents "fall-through" to next case
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;
            case 4:
                System.out.println("Thursday");
                break;
            case 5:
                System.out.println("Friday");
                break;
            case 6:
            case 7:
                System.out.println("Weekend!"); // cases 6 and 7 share same code
                break;
            default:
                System.out.println("Invalid day");
        }

        // ===== SWITCH WITH STRINGS =====
        String role = "admin";
        System.out.println("\nRole: " + role);
        switch (role.toLowerCase()) {
            case "admin":
                System.out.println("Full access granted");
                break;
            case "editor":
                System.out.println("Edit access granted");
                break;
            case "viewer":
                System.out.println("Read-only access");
                break;
            default:
                System.out.println("Unknown role");
        }

        // ===== ENHANCED SWITCH (Java 14+) =====
        // No break needed, uses arrow syntax
        String month = "MARCH";
        String season = switch (month) {
            case "DECEMBER", "JANUARY", "FEBRUARY" -> "Winter";
            case "MARCH", "APRIL", "MAY" -> "Spring";
            case "JUNE", "JULY", "AUGUST" -> "Summer";
            case "SEPTEMBER", "OCTOBER", "NOVEMBER" -> "Fall";
            default -> "Unknown";
        };
        System.out.println("\n" + month + " is in " + season);
    }
}
