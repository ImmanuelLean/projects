/**
 * LESSON: Enums
 * Enums define a fixed set of constants. They can have fields, constructors, and methods.
 */
public class EnumDemo {
    public static void main(String[] args) {
        // ===== BASIC ENUM USAGE =====
        System.out.println("--- Basic Enum ---");
        Day today = Day.WEDNESDAY;
        System.out.println("Today is: " + today);
        System.out.println("Ordinal (index): " + today.ordinal());
        System.out.println("Name: " + today.name());

        // Switch with enum
        switch (today) {
            case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY ->
                System.out.println("It's a weekday");
            case SATURDAY, SUNDAY ->
                System.out.println("It's the weekend!");
        }

        // Iterating all values
        System.out.print("All days: ");
        for (Day d : Day.values()) {
            System.out.print(d + " ");
        }
        System.out.println();

        // Convert string to enum
        Day parsed = Day.valueOf("FRIDAY");
        System.out.println("Parsed: " + parsed);

        // ===== ENUM WITH FIELDS AND METHODS =====
        System.out.println("\n--- Enum with Fields ---");
        for (Planet planet : Planet.values()) {
            System.out.printf("%-10s mass=%.2e, radius=%.2e, gravity=%.2f%n",
                planet, planet.getMass(), planet.getRadius(), planet.surfaceGravity());
        }

        // Specific planet
        double earthWeight = 75.0;
        double mass = earthWeight / Planet.EARTH.surfaceGravity();
        System.out.printf("%nYour weight on different planets (Earth weight: %.1f kg):%n", earthWeight);
        for (Planet p : Planet.values()) {
            System.out.printf("  %-10s %.2f kg%n", p, p.surfaceWeight(mass));
        }

        // ===== ENUM IMPLEMENTING INTERFACE =====
        System.out.println("\n--- Enum with Interface ---");
        for (Operation op : Operation.values()) {
            double result = op.apply(10, 3);
            System.out.printf("10 %s 3 = %.1f%n", op.getSymbol(), result);
        }
    }
}

// Simple enum
enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

// Enum with constructor, fields, and methods
enum Planet {
    MERCURY(3.303e+23, 2.4397e6),
    VENUS(4.869e+24, 6.0518e6),
    EARTH(5.976e+24, 6.37814e6),
    MARS(6.421e+23, 3.3972e6),
    JUPITER(1.9e+27, 7.1492e7);

    private final double mass;    // in kg
    private final double radius;  // in meters

    // Enum constructor is always private
    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
    }

    double getMass() { return mass; }
    double getRadius() { return radius; }

    double surfaceGravity() {
        final double G = 6.67300E-11;
        return G * mass / (radius * radius);
    }

    double surfaceWeight(double otherMass) {
        return otherMass * surfaceGravity();
    }
}

// Enum implementing interface
interface MathOperation {
    double apply(double a, double b);
}

enum Operation implements MathOperation {
    ADD("+") {
        public double apply(double a, double b) { return a + b; }
    },
    SUBTRACT("-") {
        public double apply(double a, double b) { return a - b; }
    },
    MULTIPLY("*") {
        public double apply(double a, double b) { return a * b; }
    },
    DIVIDE("/") {
        public double apply(double a, double b) { return a / b; }
    };

    private final String symbol;
    Operation(String symbol) { this.symbol = symbol; }
    String getSymbol() { return symbol; }
}
