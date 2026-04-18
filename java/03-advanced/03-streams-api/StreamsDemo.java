import java.util.*;
import java.util.stream.*;

/**
 * LESSON: Streams API
 * Streams process collections of data in a declarative, functional style.
 * A stream pipeline: Source -> Intermediate Ops -> Terminal Op
 */
public class StreamsDemo {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Emmanuel", "Alice", "Bob", "Charlie", "David",
                                           "Eve", "Alice", "Frank");
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // ===== CREATING STREAMS =====
        System.out.println("--- Creating Streams ---");
        Stream<String> fromList = names.stream();
        Stream<Integer> fromOf = Stream.of(1, 2, 3);
        Stream<Double> generated = Stream.generate(Math::random).limit(3);
        Stream<Integer> iterated = Stream.iterate(0, n -> n + 2).limit(5);
        System.out.println("Iterate: " + iterated.collect(Collectors.toList())); // [0, 2, 4, 6, 8]

        // ===== FILTER - keep elements matching condition =====
        System.out.println("\n--- filter ---");
        List<Integer> evens = numbers.stream()
            .filter(n -> n % 2 == 0)
            .collect(Collectors.toList());
        System.out.println("Evens: " + evens);

        // ===== MAP - transform each element =====
        System.out.println("\n--- map ---");
        List<String> upperNames = names.stream()
            .map(String::toUpperCase)
            .collect(Collectors.toList());
        System.out.println("Uppercase: " + upperNames);

        // ===== DISTINCT - remove duplicates =====
        System.out.println("\n--- distinct ---");
        List<String> unique = names.stream()
            .distinct()
            .collect(Collectors.toList());
        System.out.println("Unique: " + unique);

        // ===== SORTED =====
        System.out.println("\n--- sorted ---");
        List<String> sorted = names.stream()
            .distinct()
            .sorted()
            .collect(Collectors.toList());
        System.out.println("Sorted: " + sorted);

        // ===== LIMIT & SKIP =====
        System.out.println("\n--- limit & skip ---");
        List<Integer> limited = numbers.stream().limit(3).collect(Collectors.toList());
        List<Integer> skipped = numbers.stream().skip(7).collect(Collectors.toList());
        System.out.println("First 3: " + limited);
        System.out.println("Skip 7: " + skipped);

        // ===== REDUCE - combine all elements into one =====
        System.out.println("\n--- reduce ---");
        int sum = numbers.stream().reduce(0, Integer::sum);
        Optional<Integer> max = numbers.stream().reduce(Integer::max);
        System.out.println("Sum: " + sum);
        System.out.println("Max: " + max.orElse(0));

        // ===== FOREACH =====
        System.out.println("\n--- forEach ---");
        System.out.print("Numbers: ");
        numbers.stream().forEach(n -> System.out.print(n + " "));
        System.out.println();

        // ===== COLLECTORS =====
        System.out.println("\n--- Collectors ---");

        // toSet
        Set<String> nameSet = names.stream().collect(Collectors.toSet());
        System.out.println("Set: " + nameSet);

        // joining
        String joined = names.stream().distinct().collect(Collectors.joining(", "));
        System.out.println("Joined: " + joined);

        // groupingBy
        Map<Integer, List<String>> byLength = names.stream()
            .distinct()
            .collect(Collectors.groupingBy(String::length));
        System.out.println("Grouped by length: " + byLength);

        // counting
        long count = names.stream().filter(n -> n.length() > 4).count();
        System.out.println("Names longer than 4: " + count);

        // ===== FLATMAP =====
        System.out.println("\n--- flatMap ---");
        List<List<Integer>> nested = Arrays.asList(
            Arrays.asList(1, 2, 3),
            Arrays.asList(4, 5),
            Arrays.asList(6, 7, 8, 9)
        );
        List<Integer> flat = nested.stream()
            .flatMap(Collection::stream)
            .collect(Collectors.toList());
        System.out.println("Flattened: " + flat);

        // ===== MATCH OPERATIONS =====
        System.out.println("\n--- Match ---");
        boolean anyEven = numbers.stream().anyMatch(n -> n % 2 == 0);
        boolean allPositive = numbers.stream().allMatch(n -> n > 0);
        boolean noneNegative = numbers.stream().noneMatch(n -> n < 0);
        System.out.println("Any even? " + anyEven);
        System.out.println("All positive? " + allPositive);
        System.out.println("None negative? " + noneNegative);

        // ===== OPTIONAL =====
        System.out.println("\n--- Optional ---");
        Optional<String> found = names.stream()
            .filter(n -> n.startsWith("E"))
            .findFirst();
        System.out.println("Found: " + found.orElse("Not found"));

        Optional<String> empty = names.stream()
            .filter(n -> n.startsWith("Z"))
            .findFirst();
        System.out.println("Not found: " + empty.orElse("Default value"));

        // ===== CHAINING (Practical Example) =====
        System.out.println("\n--- Chained Pipeline ---");
        String result = names.stream()
            .filter(n -> n.length() > 3)     // keep names > 3 chars
            .distinct()                       // remove duplicates
            .sorted()                         // sort alphabetically
            .map(String::toUpperCase)         // convert to uppercase
            .collect(Collectors.joining(", ")); // join with comma
        System.out.println("Result: " + result);
    }
}
