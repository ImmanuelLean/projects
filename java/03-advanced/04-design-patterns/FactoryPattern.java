/**
 * LESSON: Factory Design Pattern
 * Creates objects without exposing the creation logic to the client.
 * The client uses a factory method to get objects.
 */
public class FactoryPattern {
    public static void main(String[] args) {
        // Client doesn't need to know about Circle, Rectangle, Triangle classes
        ShapeInterface s1 = ShapeFactory.createShape("circle");
        ShapeInterface s2 = ShapeFactory.createShape("rectangle");
        ShapeInterface s3 = ShapeFactory.createShape("triangle");

        System.out.println("--- Factory Pattern ---");
        s1.draw();
        s2.draw();
        s3.draw();

        System.out.println("\n--- Area Calculation ---");
        System.out.printf("Circle area: %.2f%n", s1.area());
        System.out.printf("Rectangle area: %.2f%n", s2.area());
        System.out.printf("Triangle area: %.2f%n", s3.area());

        // Invalid shape
        try {
            ShapeFactory.createShape("hexagon");
        } catch (IllegalArgumentException e) {
            System.out.println("\nError: " + e.getMessage());
        }
    }
}

// Product interface
interface ShapeInterface {
    void draw();
    double area();
}

// Concrete products
class CircleImpl implements ShapeInterface {
    private double radius = 5;

    @Override
    public void draw() { System.out.println("Drawing a Circle ⭕"); }

    @Override
    public double area() { return Math.PI * radius * radius; }
}

class RectangleImpl implements ShapeInterface {
    private double width = 4, height = 6;

    @Override
    public void draw() { System.out.println("Drawing a Rectangle ▬"); }

    @Override
    public double area() { return width * height; }
}

class TriangleImpl implements ShapeInterface {
    private double base = 3, height = 8;

    @Override
    public void draw() { System.out.println("Drawing a Triangle △"); }

    @Override
    public double area() { return 0.5 * base * height; }
}

// Factory class - creates objects based on input
class ShapeFactory {
    static ShapeInterface createShape(String type) {
        return switch (type.toLowerCase()) {
            case "circle" -> new CircleImpl();
            case "rectangle" -> new RectangleImpl();
            case "triangle" -> new TriangleImpl();
            default -> throw new IllegalArgumentException("Unknown shape: " + type);
        };
    }
}
