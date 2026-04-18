import java.util.*;

/**
 * LESSON: Generics
 * Generics allow classes and methods to work with any type while providing
 * compile-time type safety. No casting needed!
 */
public class GenericsDemo {
    public static void main(String[] args) {
        // ===== GENERIC CLASS =====
        System.out.println("--- Generic Class (Box<T>) ---");
        Box<String> stringBox = new Box<>("Hello Generics!");
        Box<Integer> intBox = new Box<>(42);
        Box<Double> doubleBox = new Box<>(3.14);

        System.out.println("String box: " + stringBox.getValue());
        System.out.println("Integer box: " + intBox.getValue());
        System.out.println("Double box: " + doubleBox.getValue());

        // ===== GENERIC CLASS WITH TWO TYPES =====
        System.out.println("\n--- Pair<K, V> ---");
        Pair<String, Integer> student = new Pair<>("Emmanuel", 95);
        System.out.println(student.getKey() + " scored " + student.getValue());

        // ===== GENERIC METHOD =====
        System.out.println("\n--- Generic Method ---");
        Integer[] intArr = {1, 2, 3, 4, 5};
        String[] strArr = {"A", "B", "C"};
        printArray(intArr);
        printArray(strArr);

        // ===== BOUNDED TYPES =====
        System.out.println("\n--- Bounded Type (<T extends Number>) ---");
        System.out.println("Sum of ints: " + sumOfList(Arrays.asList(1, 2, 3, 4, 5)));
        System.out.println("Sum of doubles: " + sumOfList(Arrays.asList(1.5, 2.5, 3.0)));

        // ===== WILDCARDS =====
        System.out.println("\n--- Wildcards ---");
        List<Integer> ints = Arrays.asList(1, 2, 3);
        List<Double> doubles = Arrays.asList(1.1, 2.2, 3.3);
        List<String> strings = Arrays.asList("A", "B", "C");

        // ? extends Number - accepts Number and its subclasses
        printNumbers(ints);
        printNumbers(doubles);

        // ? - unbounded wildcard, accepts any type
        printAll(strings);
        printAll(ints);
    }

    // Generic method - works with any type
    static <T> void printArray(T[] array) {
        System.out.print("[ ");
        for (T element : array) {
            System.out.print(element + " ");
        }
        System.out.println("]");
    }

    // Bounded type parameter - only accepts Number and subclasses
    static <T extends Number> double sumOfList(List<T> list) {
        double sum = 0;
        for (T num : list) {
            sum += num.doubleValue();
        }
        return sum;
    }

    // Upper bounded wildcard
    static void printNumbers(List<? extends Number> list) {
        System.out.print("Numbers: ");
        for (Number n : list) {
            System.out.print(n + " ");
        }
        System.out.println();
    }

    // Unbounded wildcard
    static void printAll(List<?> list) {
        System.out.print("Items: ");
        for (Object item : list) {
            System.out.print(item + " ");
        }
        System.out.println();
    }
}

// Generic class with one type parameter
class Box<T> {
    private T value;

    Box(T value) { this.value = value; }
    T getValue() { return value; }
    void setValue(T value) { this.value = value; }
}

// Generic class with two type parameters
class Pair<K, V> {
    private K key;
    private V value;

    Pair(K key, V value) { this.key = key; this.value = value; }
    K getKey() { return key; }
    V getValue() { return value; }
}
