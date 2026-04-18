import java.util.*;

/**
 * LESSON: Records (Java 14+) and Sealed Classes (Java 17+)
 *
 * Records: Concise way to create immutable data-carrying classes.
 *   Automatically generates: constructor, getters, equals(), hashCode(), toString()
 *
 * Sealed Classes: Restrict which classes can extend/implement a class/interface.
 *   Uses: sealed, permits, non-sealed, final keywords
 */
public class RecordsAndSealed {
    public static void main(String[] args) {
        // ===== RECORDS =====
        System.out.println("--- Records ---");

        // Creating record instances
        Point p1 = new Point(3, 4);
        Point p2 = new Point(3, 4);
        Point p3 = new Point(1, 2);

        // Auto-generated accessor methods (no "get" prefix)
        System.out.println("x: " + p1.x() + ", y: " + p1.y());

        // Auto-generated toString()
        System.out.println("p1: " + p1);

        // Auto-generated equals() and hashCode()
        System.out.println("p1.equals(p2): " + p1.equals(p2)); // true
        System.out.println("p1.equals(p3): " + p1.equals(p3)); // false
        System.out.println("Same hash? " + (p1.hashCode() == p2.hashCode()));

        // Custom method in record
        System.out.println("Distance from origin: " + p1.distanceFromOrigin());

        // Record with validation
        System.out.println("\n--- Record with Validation ---");
        StudentRecord s = new StudentRecord("Emmanuel", 20, 3.8);
        System.out.println(s);
        System.out.println("Is honors? " + s.isHonors());

        try {
            new StudentRecord("", -1, 5.0); // will throw
        } catch (IllegalArgumentException e) {
            System.out.println("Validation error: " + e.getMessage());
        }

        // Records work great with collections
        System.out.println("\n--- Records in Collections ---");
        List<StudentRecord> students = List.of(
            new StudentRecord("Alice", 22, 3.9),
            new StudentRecord("Bob", 21, 3.2),
            new StudentRecord("Charlie", 23, 3.7)
        );
        students.stream()
            .sorted(Comparator.comparing(StudentRecord::gpa).reversed())
            .forEach(System.out::println);

        // ===== SEALED CLASSES =====
        System.out.println("\n--- Sealed Classes ---");

        // Only Circle2D, Rectangle2D, Triangle2D can extend Shape2D
        Shape2D circle = new Circle2D(5);
        Shape2D rect = new Rectangle2D(4, 6);
        Shape2D triangle = new Triangle2D(3, 4, 5);

        Shape2D[] shapes = {circle, rect, triangle};
        for (Shape2D shape : shapes) {
            System.out.printf("%s -> area: %.2f%n", shape.name(), shape.area());
        }

        // Pattern matching with sealed classes (Java 21+)
        // The compiler knows all possible subtypes!
        for (Shape2D shape : shapes) {
            String info = switch (shape) {
                case Circle2D c -> "Circle with radius " + c.radius();
                case Rectangle2D r -> "Rectangle " + r.width() + "x" + r.height();
                case Triangle2D t -> "Triangle with sides " + t.a() + "," + t.b() + "," + t.c();
            };
            System.out.println(info);
        }
    }
}

// ===== RECORD: immutable data class in one line =====
record Point(int x, int y) {
    // Custom method
    double distanceFromOrigin() {
        return Math.sqrt(x * x + y * y);
    }
}

// Record with compact constructor (for validation)
record StudentRecord(String name, int age, double gpa) {
    // Compact constructor - validates parameters
    StudentRecord {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Name required");
        if (age < 0) throw new IllegalArgumentException("Age must be positive");
        if (gpa < 0 || gpa > 4.0) throw new IllegalArgumentException("GPA must be 0-4.0");
    }

    // Custom method
    boolean isHonors() { return gpa >= 3.5; }
}

// ===== SEALED CLASS: only permitted subclasses can extend =====
sealed interface Shape2D permits Circle2D, Rectangle2D, Triangle2D {
    double area();
    String name();
}

// 'final' - cannot be extended further
record Circle2D(double radius) implements Shape2D {
    public double area() { return Math.PI * radius * radius; }
    public String name() { return "Circle"; }
}

record Rectangle2D(double width, double height) implements Shape2D {
    public double area() { return width * height; }
    public String name() { return "Rectangle"; }
}

record Triangle2D(double a, double b, double c) implements Shape2D {
    public double area() {
        double s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }
    public String name() { return "Triangle"; }
}
