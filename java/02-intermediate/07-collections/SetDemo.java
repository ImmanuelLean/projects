import java.util.*;

/**
 * LESSON: Sets
 * Sets store UNIQUE elements only - no duplicates allowed.
 *
 * HashSet       - no ordering, fastest
 * LinkedHashSet - maintains insertion order
 * TreeSet       - sorted (natural ordering)
 */
public class SetDemo {
    public static void main(String[] args) {
        // ===== HASHSET =====
        System.out.println("--- HashSet ---");
        HashSet<String> languages = new HashSet<>();
        languages.add("Java");
        languages.add("Python");
        languages.add("C++");
        languages.add("Java");     // duplicate - ignored!
        languages.add("JavaScript");
        System.out.println("Languages: " + languages); // no order guaranteed
        System.out.println("Size: " + languages.size()); // 4, not 5

        // Checking and removing
        System.out.println("Contains Java? " + languages.contains("Java"));
        languages.remove("C++");
        System.out.println("After remove C++: " + languages);

        // ===== LINKEDHASHSET (insertion order) =====
        System.out.println("\n--- LinkedHashSet (insertion order) ---");
        LinkedHashSet<String> ordered = new LinkedHashSet<>();
        ordered.add("First");
        ordered.add("Second");
        ordered.add("Third");
        ordered.add("First"); // duplicate ignored
        System.out.println("Ordered: " + ordered); // maintains insertion order

        // ===== TREESET (sorted) =====
        System.out.println("\n--- TreeSet (sorted) ---");
        TreeSet<Integer> numbers = new TreeSet<>();
        numbers.add(50);
        numbers.add(10);
        numbers.add(30);
        numbers.add(20);
        numbers.add(40);
        System.out.println("Sorted: " + numbers); // [10, 20, 30, 40, 50]
        System.out.println("First: " + numbers.first());
        System.out.println("Last: " + numbers.last());
        System.out.println("HeadSet(<30): " + numbers.headSet(30)); // elements < 30

        // ===== SET OPERATIONS =====
        System.out.println("\n--- Set Operations ---");
        Set<Integer> setA = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5));
        Set<Integer> setB = new HashSet<>(Arrays.asList(4, 5, 6, 7, 8));

        // Union (A ∪ B)
        Set<Integer> union = new HashSet<>(setA);
        union.addAll(setB);
        System.out.println("Union: " + union);

        // Intersection (A ∩ B)
        Set<Integer> intersection = new HashSet<>(setA);
        intersection.retainAll(setB);
        System.out.println("Intersection: " + intersection);

        // Difference (A - B)
        Set<Integer> difference = new HashSet<>(setA);
        difference.removeAll(setB);
        System.out.println("Difference (A-B): " + difference);

        // ===== ITERATING =====
        System.out.println("\n--- Iterating ---");
        for (String lang : languages) {
            System.out.println("  " + lang);
        }
    }
}
