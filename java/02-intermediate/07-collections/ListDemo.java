import java.util.*;

/**
 * LESSON: Lists (ArrayList and LinkedList)
 * Lists are ordered, allow duplicates, and are dynamically sized.
 *
 * ArrayList  - fast random access (get/set), slower insert/delete in middle
 * LinkedList - fast insert/delete anywhere, slower random access
 */
public class ListDemo {
    public static void main(String[] args) {
        // ===== ARRAYLIST =====
        System.out.println("--- ArrayList ---");
        ArrayList<String> fruits = new ArrayList<>();

        // Adding elements
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Cherry");
        fruits.add("Banana"); // duplicates allowed
        fruits.add(1, "Avocado"); // insert at index 1
        System.out.println("Fruits: " + fruits);

        // Accessing
        System.out.println("First: " + fruits.get(0));
        System.out.println("Size: " + fruits.size());

        // Modifying
        fruits.set(0, "Apricot"); // replace at index
        System.out.println("After set: " + fruits);

        // Searching
        System.out.println("Contains Banana? " + fruits.contains("Banana"));
        System.out.println("Index of Banana: " + fruits.indexOf("Banana"));

        // Removing
        fruits.remove("Banana"); // removes first occurrence
        fruits.remove(0);        // removes by index
        System.out.println("After remove: " + fruits);

        // ===== ITERATING =====
        System.out.println("\n--- Iterating ---");
        List<Integer> numbers = new ArrayList<>(Arrays.asList(5, 2, 8, 1, 9, 3));

        // For-each
        System.out.print("For-each: ");
        for (int n : numbers) {
            System.out.print(n + " ");
        }

        // Iterator
        System.out.print("\nIterator: ");
        Iterator<Integer> it = numbers.iterator();
        while (it.hasNext()) {
            System.out.print(it.next() + " ");
        }

        // ===== SORTING =====
        System.out.println("\n\n--- Sorting ---");
        Collections.sort(numbers);
        System.out.println("Ascending: " + numbers);

        Collections.sort(numbers, Collections.reverseOrder());
        System.out.println("Descending: " + numbers);

        // ===== SUBLIST =====
        List<Integer> sub = numbers.subList(1, 4);
        System.out.println("Sublist [1,4): " + sub);

        // ===== LINKEDLIST =====
        System.out.println("\n--- LinkedList ---");
        LinkedList<String> tasks = new LinkedList<>();
        tasks.add("Task 1");
        tasks.add("Task 2");
        tasks.addFirst("Urgent Task"); // LinkedList-specific
        tasks.addLast("Low Priority");
        System.out.println("Tasks: " + tasks);
        System.out.println("First: " + tasks.getFirst());
        System.out.println("Last: " + tasks.getLast());
        tasks.removeFirst();
        System.out.println("After removeFirst: " + tasks);
    }
}
