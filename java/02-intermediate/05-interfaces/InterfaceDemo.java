/**
 * LESSON: Interfaces
 * An interface is a contract - it defines WHAT a class must do, not HOW.
 * A class can implement MULTIPLE interfaces (unlike classes).
 */
public class InterfaceDemo {
    public static void main(String[] args) {
        SmartPhone phone = new SmartPhone("iPhone 15");

        // Using interface methods
        System.out.println("--- Drawable ---");
        phone.draw();
        phone.setColor("Blue");

        System.out.println("\n--- Resizable ---");
        phone.resize(200, 400);

        System.out.println("\n--- Clickable ---");
        phone.click();
        phone.doubleClick();

        // Interface as type (polymorphism)
        System.out.println("\n--- Interface as Type ---");
        Drawable d = phone;
        d.draw(); // can only call Drawable methods through this reference

        // Default method from interface
        System.out.println("\n--- Default Methods ---");
        phone.displayInfo(); // default method from Drawable
    }
}

// Interface 1
interface Drawable {
    // Abstract method (implicitly public abstract)
    void draw();
    void setColor(String color);

    // Default method (Java 8+) - provides a default implementation
    default void displayInfo() {
        System.out.println("This is a drawable object");
    }

    // Static method (Java 8+) - called on the interface itself
    static String getType() {
        return "2D Drawable";
    }
}

// Interface 2
interface Resizable {
    void resize(int width, int height);

    // Constants in interfaces are implicitly public static final
    int MIN_SIZE = 10;
    int MAX_SIZE = 10000;
}

// Interface 3
interface Clickable {
    void click();

    default void doubleClick() {
        System.out.println("Double clicked!");
    }
}

// A class implementing MULTIPLE interfaces
class SmartPhone implements Drawable, Resizable, Clickable {
    private String model;
    private String color = "Black";

    SmartPhone(String model) {
        this.model = model;
    }

    @Override
    public void draw() {
        System.out.println("Drawing " + model + " in " + color);
    }

    @Override
    public void setColor(String color) {
        this.color = color;
        System.out.println("Color set to: " + color);
    }

    @Override
    public void resize(int width, int height) {
        if (width >= Resizable.MIN_SIZE && height >= Resizable.MAX_SIZE) {
            System.out.println("Resizing within bounds");
        }
        System.out.println("Resized to " + width + "x" + height);
    }

    @Override
    public void click() {
        System.out.println(model + " clicked!");
    }
}
