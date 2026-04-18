import java.util.*;

/**
 * LESSON: Comparable and Comparator
 * Used for sorting custom objects.
 *
 * Comparable<T> - defines the NATURAL ordering of a class (compareTo method)
 * Comparator<T> - defines CUSTOM orderings externally (compare method)
 */
public class ComparableComparator {
    public static void main(String[] args) {
        List<Employee> employees = new ArrayList<>(Arrays.asList(
            new Employee("Emmanuel", 25, 75000),
            new Employee("Alice", 30, 85000),
            new Employee("Bob", 22, 65000),
            new Employee("Charlie", 28, 75000),
            new Employee("Diana", 25, 90000)
        ));

        // ===== COMPARABLE (Natural Ordering) =====
        System.out.println("--- Original ---");
        employees.forEach(System.out::println);

        Collections.sort(employees); // uses compareTo (sorts by name)
        System.out.println("\n--- Sorted by Name (Comparable - natural order) ---");
        employees.forEach(System.out::println);

        // ===== COMPARATOR (Custom Ordering) =====

        // Sort by age
        employees.sort(Comparator.comparingInt(Employee::getAge));
        System.out.println("\n--- Sorted by Age ---");
        employees.forEach(System.out::println);

        // Sort by salary (descending)
        employees.sort(Comparator.comparingDouble(Employee::getSalary).reversed());
        System.out.println("\n--- Sorted by Salary (descending) ---");
        employees.forEach(System.out::println);

        // ===== CHAINED COMPARATORS =====
        // Sort by salary, then by name if salary is equal
        employees.sort(
            Comparator.comparingDouble(Employee::getSalary)
                       .thenComparing(Employee::getName)
        );
        System.out.println("\n--- Sorted by Salary, then Name ---");
        employees.forEach(System.out::println);

        // Sort by age descending, then name ascending
        employees.sort(
            Comparator.comparingInt(Employee::getAge).reversed()
                       .thenComparing(Employee::getName)
        );
        System.out.println("\n--- Sorted by Age (desc), then Name (asc) ---");
        employees.forEach(System.out::println);

        // ===== ANONYMOUS COMPARATOR =====
        System.out.println("\n--- Lambda Comparator (by name length) ---");
        employees.sort((a, b) -> a.getName().length() - b.getName().length());
        employees.forEach(System.out::println);

        // ===== MIN / MAX =====
        System.out.println("\n--- Min/Max ---");
        Employee youngest = Collections.min(employees, Comparator.comparingInt(Employee::getAge));
        Employee highestPaid = Collections.max(employees, Comparator.comparingDouble(Employee::getSalary));
        System.out.println("Youngest: " + youngest);
        System.out.println("Highest paid: " + highestPaid);
    }
}

// Implements Comparable for natural ordering (by name)
class Employee implements Comparable<Employee> {
    private String name;
    private int age;
    private double salary;

    Employee(String name, int age, double salary) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }

    String getName() { return name; }
    int getAge() { return age; }
    double getSalary() { return salary; }

    // Natural ordering: by name (alphabetical)
    @Override
    public int compareTo(Employee other) {
        return this.name.compareTo(other.name);
        // Returns: negative (this < other), 0 (equal), positive (this > other)
    }

    @Override
    public String toString() {
        return String.format("%-10s age=%d  salary=$%.0f", name, age, salary);
    }
}
