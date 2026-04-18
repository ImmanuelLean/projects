/**
 * LESSON: Types of Inheritance
 * Java supports: Single, Multilevel, and Hierarchical inheritance.
 * Java does NOT support multiple inheritance with classes (use interfaces instead).
 */
public class TypesOfInheritance {
    public static void main(String[] args) {
        // ===== SINGLE INHERITANCE: A -> B =====
        System.out.println("--- Single Inheritance ---");
        Car car = new Car();
        car.start();
        car.drive();

        // ===== MULTILEVEL INHERITANCE: A -> B -> C =====
        System.out.println("\n--- Multilevel Inheritance ---");
        Puppy puppy = new Puppy();
        puppy.breathe();     // from LivingThing
        puppy.bark();        // from Canine
        puppy.playful();     // from Puppy

        // ===== HIERARCHICAL INHERITANCE: A -> B, A -> C =====
        System.out.println("\n--- Hierarchical Inheritance ---");
        Circle circle = new Circle(5);
        Rectangle rect = new Rectangle(4, 6);
        System.out.println("Circle area: " + circle.area());
        System.out.println("Rectangle area: " + rect.area());

        // Why Java doesn't support multiple inheritance with classes:
        // class A { void show() {} }
        // class B { void show() {} }
        // class C extends A, B {} // AMBIGUOUS! Which show() to use?
        // Solution: Use interfaces (covered in interfaces lesson)
    }
}

// ===== SINGLE: Vehicle -> Car =====
class Vehicle {
    void start() { System.out.println("Vehicle started"); }
}

class Car extends Vehicle {
    void drive() { System.out.println("Car is driving"); }
}

// ===== MULTILEVEL: LivingThing -> Canine -> Puppy =====
class LivingThing {
    void breathe() { System.out.println("Breathing..."); }
}

class Canine extends LivingThing {
    void bark() { System.out.println("Barking!"); }
}

class Puppy extends Canine {
    void playful() { System.out.println("Puppy is playing!"); }
}

// ===== HIERARCHICAL: Shape -> Circle, Shape -> Rectangle =====
class Shape {
    double area() { return 0; }
}

class Circle extends Shape {
    private double radius;
    Circle(double radius) { this.radius = radius; }

    @Override
    double area() { return Math.PI * radius * radius; }
}

class Rectangle extends Shape {
    private double width, height;
    Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    double area() { return width * height; }
}
