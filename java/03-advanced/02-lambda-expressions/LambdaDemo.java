import java.util.*;
import java.util.function.*;

/**
 * LESSON: Lambda Expressions & Functional Interfaces
 * Lambdas provide a concise way to represent anonymous functions.
 * Syntax: (parameters) -> expression  OR  (parameters) -> { statements }
 */
public class LambdaDemo {
    public static void main(String[] args) {
        // ===== BASIC LAMBDA SYNTAX =====
        System.out.println("--- Basic Lambda ---");

        // Without lambda (anonymous class)
        Runnable oldWay = new Runnable() {
            @Override
            public void run() { System.out.println("Old way: anonymous class"); }
        };

        // With lambda (much shorter!)
        Runnable newWay = () -> System.out.println("New way: lambda!");

        oldWay.run();
        newWay.run();

        // ===== PREDICATE<T> - takes T, returns boolean =====
        System.out.println("\n--- Predicate ---");
        Predicate<Integer> isEven = n -> n % 2 == 0;
        Predicate<String> isLong = s -> s.length() > 5;

        System.out.println("4 is even? " + isEven.test(4));     // true
        System.out.println("7 is even? " + isEven.test(7));     // false
        System.out.println("\"Hello\" is long? " + isLong.test("Hello")); // false

        // Combining predicates
        Predicate<Integer> isPositive = n -> n > 0;
        Predicate<Integer> isPositiveAndEven = isPositive.and(isEven);
        System.out.println("4 is positive and even? " + isPositiveAndEven.test(4)); // true

        // ===== CONSUMER<T> - takes T, returns nothing =====
        System.out.println("\n--- Consumer ---");
        Consumer<String> shout = s -> System.out.println(s.toUpperCase() + "!");
        shout.accept("hello");
        shout.accept("java is awesome");

        // ===== FUNCTION<T, R> - takes T, returns R =====
        System.out.println("\n--- Function ---");
        Function<String, Integer> strLength = String::length; // method reference
        Function<Integer, Integer> doubleIt = n -> n * 2;

        System.out.println("Length of 'Hello': " + strLength.apply("Hello")); // 5

        // Chaining functions
        Function<String, Integer> lengthThenDouble = strLength.andThen(doubleIt);
        System.out.println("Length * 2 of 'Hello': " + lengthThenDouble.apply("Hello")); // 10

        // ===== SUPPLIER<T> - takes nothing, returns T =====
        System.out.println("\n--- Supplier ---");
        Supplier<Double> randomNum = Math::random;
        Supplier<String> greeting = () -> "Hello, World!";
        System.out.println("Random: " + randomNum.get());
        System.out.println("Greeting: " + greeting.get());

        // ===== BIFUNCTION<T, U, R> =====
        System.out.println("\n--- BiFunction ---");
        BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
        BiFunction<String, String, String> concat = (a, b) -> a + " " + b;
        System.out.println("3 + 5 = " + add.apply(3, 5));
        System.out.println(concat.apply("Hello", "World"));

        // ===== METHOD REFERENCES =====
        System.out.println("\n--- Method References ---");
        List<String> names = Arrays.asList("Charlie", "Alice", "Bob", "David");

        // Static method reference: ClassName::methodName
        names.sort(String::compareToIgnoreCase);
        System.out.println("Sorted: " + names);

        // Instance method reference: instance::methodName
        names.forEach(System.out::println);

        // Constructor reference: ClassName::new
        Function<String, StringBuilder> toSB = StringBuilder::new;
        StringBuilder sb = toSB.apply("Built with constructor reference");
        System.out.println("StringBuilder: " + sb);

        // ===== PRACTICAL: Sorting with Lambda =====
        System.out.println("\n--- Sorting with Lambda ---");
        List<String> fruits = Arrays.asList("Banana", "Apple", "Cherry", "Date");
        fruits.sort((a, b) -> a.compareTo(b)); // ascending
        System.out.println("Ascending: " + fruits);
        fruits.sort((a, b) -> b.compareTo(a)); // descending
        System.out.println("Descending: " + fruits);
    }
}
