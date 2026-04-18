import java.util.*;

/**
 * LESSON: Immutable Classes
 * An immutable object cannot be changed after creation.
 *
 * Rules for creating immutable classes:
 *   1. Declare class as final (prevents subclassing)
 *   2. Make all fields private and final
 *   3. No setter methods
 *   4. Initialize all fields via constructor
 *   5. Return defensive copies of mutable objects
 *
 * Benefits: Thread-safe, cacheable, safe as Map keys, no side effects.
 */
public class ImmutableClass {
    public static void main(String[] args) {
        // ===== CREATING IMMUTABLE OBJECT =====
        List<String> skills = new ArrayList<>(Arrays.asList("Java", "Python"));
        Date joinDate = new Date();

        ImmutableEmployee emp = new ImmutableEmployee("Emmanuel", 101, skills, joinDate);

        System.out.println("--- Immutable Employee ---");
        System.out.println(emp);

        // ===== TRYING TO MODIFY (all fail!) =====
        System.out.println("\n--- Attempting Modifications ---");

        // 1. Can't modify original list to affect the object
        skills.add("C++");
        System.out.println("Original list modified: " + skills);
        System.out.println("Employee skills unchanged: " + emp.getSkills());

        // 2. Can't modify returned list
        try {
            emp.getSkills().add("Hacking!"); // returns unmodifiable copy
        } catch (UnsupportedOperationException e) {
            System.out.println("Cannot modify returned skills list!");
        }

        // 3. Can't modify date through original reference
        joinDate.setTime(0);
        System.out.println("Original date modified: " + joinDate);
        System.out.println("Employee date unchanged: " + emp.getJoinDate());

        // 4. Can't modify date from getter
        emp.getJoinDate().setTime(0); // modifies the copy, not the original
        System.out.println("Employee date still unchanged: " + emp.getJoinDate());

        // ===== COMPARISON: String is immutable =====
        System.out.println("\n--- String is Immutable ---");
        String s = "Hello";
        String s2 = s.toUpperCase(); // creates NEW string
        System.out.println("Original: " + s);    // still "Hello"
        System.out.println("New: " + s2);         // "HELLO"
    }
}

// Immutable class - follows all 5 rules
final class ImmutableEmployee {
    private final String name;
    private final int id;
    private final List<String> skills;   // mutable field - needs defensive copy
    private final Date joinDate;         // mutable field - needs defensive copy

    ImmutableEmployee(String name, int id, List<String> skills, Date joinDate) {
        this.name = name;
        this.id = id;
        // Defensive copy: create new list so external changes don't affect us
        this.skills = new ArrayList<>(skills);
        // Defensive copy: create new Date
        this.joinDate = new Date(joinDate.getTime());
    }

    // Only getters, NO setters
    String getName() { return name; }
    int getId() { return id; }

    // Return unmodifiable copy of mutable fields
    List<String> getSkills() {
        return Collections.unmodifiableList(skills);
    }

    // Return defensive copy of mutable Date
    Date getJoinDate() {
        return new Date(joinDate.getTime());
    }

    @Override
    public String toString() {
        return String.format("Employee{name='%s', id=%d, skills=%s, joined=%s}",
            name, id, skills, joinDate);
    }
}
