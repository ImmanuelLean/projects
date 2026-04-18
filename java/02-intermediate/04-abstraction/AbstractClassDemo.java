/**
 * LESSON: Abstract Classes
 * An abstract class cannot be instantiated. It can have:
 *   - Abstract methods (no body - subclasses MUST implement)
 *   - Concrete methods (with body - subclasses inherit)
 */
public class AbstractClassDemo {
    public static void main(String[] args) {
        // Cannot do: AbstractShape s = new AbstractShape(); // ERROR!

        AbstractShape circle = new CircleShape(5);
        AbstractShape rectangle = new RectangleShape(4, 6);
        AbstractShape triangle = new TriangleShape(3, 8);

        // Polymorphism with abstract class
        AbstractShape[] shapes = {circle, rectangle, triangle};

        for (AbstractShape shape : shapes) {
            shape.displayInfo(); // concrete method from abstract class
            System.out.printf("  Area: %.2f%n", shape.area());         // abstract -> implemented
            System.out.printf("  Perimeter: %.2f%n", shape.perimeter()); // abstract -> implemented
            System.out.println();
        }
    }
}

// Abstract class - the blueprint
abstract class AbstractShape {
    private String name;

    AbstractShape(String name) {
        this.name = name;
    }

    // Abstract methods - NO body, subclasses MUST provide implementation
    abstract double area();
    abstract double perimeter();

    // Concrete method - has a body, inherited by subclasses
    void displayInfo() {
        System.out.println("Shape: " + name);
    }

    String getName() { return name; }
}

class CircleShape extends AbstractShape {
    private double radius;

    CircleShape(double radius) {
        super("Circle");
        this.radius = radius;
    }

    @Override
    double area() { return Math.PI * radius * radius; }

    @Override
    double perimeter() { return 2 * Math.PI * radius; }
}

class RectangleShape extends AbstractShape {
    private double width, height;

    RectangleShape(double width, double height) {
        super("Rectangle");
        this.width = width;
        this.height = height;
    }

    @Override
    double area() { return width * height; }

    @Override
    double perimeter() { return 2 * (width + height); }
}

class TriangleShape extends AbstractShape {
    private double base, height;

    TriangleShape(double base, double height) {
        super("Triangle");
        this.base = base;
        this.height = height;
    }

    @Override
    double area() { return 0.5 * base * height; }

    @Override
    double perimeter() {
        // Approximate for right triangle
        double hypotenuse = Math.sqrt(base * base + height * height);
        return base + height + hypotenuse;
    }
}
