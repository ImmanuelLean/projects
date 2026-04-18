import java.util.*;

/**
 * LESSON: Maps (Key-Value Pairs)
 * Maps store data as key-value pairs. Keys must be unique.
 *
 * HashMap       - no ordering, fastest
 * LinkedHashMap - maintains insertion order
 * TreeMap       - sorted by keys (natural ordering)
 */
public class MapDemo {
    public static void main(String[] args) {
        // ===== HASHMAP =====
        System.out.println("--- HashMap ---");
        HashMap<String, Integer> scores = new HashMap<>();

        // Adding entries
        scores.put("Emmanuel", 95);
        scores.put("Alice", 88);
        scores.put("Bob", 72);
        scores.put("Charlie", 91);
        System.out.println("Scores: " + scores); // no guaranteed order

        // Accessing
        System.out.println("Emmanuel's score: " + scores.get("Emmanuel"));
        System.out.println("Unknown: " + scores.getOrDefault("Unknown", 0));

        // Checking
        System.out.println("Contains key 'Bob'? " + scores.containsKey("Bob"));
        System.out.println("Contains value 88? " + scores.containsValue(88));
        System.out.println("Size: " + scores.size());

        // Modifying
        scores.put("Alice", 92); // overwrites existing value
        scores.putIfAbsent("Dave", 85); // only adds if key doesn't exist
        scores.replace("Bob", 75); // replace existing
        System.out.println("Updated: " + scores);

        // Removing
        scores.remove("Charlie");
        System.out.println("After remove: " + scores);

        // ===== ITERATING MAPS =====
        System.out.println("\n--- Iterating ---");

        // Keys
        System.out.print("Keys: ");
        for (String key : scores.keySet()) {
            System.out.print(key + " ");
        }

        // Values
        System.out.print("\nValues: ");
        for (int value : scores.values()) {
            System.out.print(value + " ");
        }

        // Key-Value pairs (most common)
        System.out.println("\nEntries:");
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println("  " + entry.getKey() + " -> " + entry.getValue());
        }

        // ===== LINKEDHASHMAP (insertion order) =====
        System.out.println("\n--- LinkedHashMap (insertion order) ---");
        LinkedHashMap<String, String> capitals = new LinkedHashMap<>();
        capitals.put("Nigeria", "Abuja");
        capitals.put("Ghana", "Accra");
        capitals.put("Kenya", "Nairobi");
        capitals.put("Egypt", "Cairo");
        System.out.println("Capitals: " + capitals); // maintains insertion order

        // ===== TREEMAP (sorted by keys) =====
        System.out.println("\n--- TreeMap (sorted by keys) ---");
        TreeMap<String, Integer> sorted = new TreeMap<>(scores);
        System.out.println("Sorted: " + sorted); // alphabetical order
        System.out.println("First key: " + sorted.firstKey());
        System.out.println("Last key: " + sorted.lastKey());
    }
}
